"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"
import Header from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogContributionModal } from "@/components/contributions/log-contribution-modal"
import { Plus, LogOut, DollarSign, Calendar, FileText, CheckCircle, Clock, AlertCircle, ArrowLeft, Download, AlertTriangle, Ban } from "lucide-react"
import Link from "next/link"
import { auth, db } from "@/lib/firebase/client"
import { collection, query, where, onSnapshot, Timestamp, doc, updateDoc } from "firebase/firestore"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Contribution {
  id: string;
  amount: number;
  date: Date;
  status: "approved" | "pending" | "declined";
  description: string;
  proofURL: string;
  rejectionReason?: string;
}

function ContributionsContent() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoadingContributions, setIsLoadingContributions] = useState(true);

  useEffect(() => {
    if (!user) return;

    setIsLoadingContributions(true);
    const contributionsQuery = query(collection(db, 'payments'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(contributionsQuery, (querySnapshot) => {
      const fetchedContributions: Contribution[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let contributionDate = new Date();
        if (data.date && typeof data.date.toDate === 'function') {
            contributionDate = (data.date as Timestamp).toDate();
        } else if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            contributionDate = (data.createdAt as Timestamp).toDate();
        }

        fetchedContributions.push({
          id: doc.id,
          amount: data.amount,
          date: contributionDate,
          status: data.status,
          description: data.description || `Contribution on ${contributionDate.toLocaleDateString()}`,
          proofURL: data.proofURL,
          rejectionReason: data.rejectionReason,
        });
      });
      fetchedContributions.sort((a, b) => b.date.getTime() - a.date.getTime());
      setContributions(fetchedContributions);
      setIsLoadingContributions(false);
    });

    return () => unsubscribe();
  }, [user]);

  const logout = async () => {
    await auth.signOut();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "declined": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-green-500 text-white">Verified</Badge>;
      case "pending": return <Badge variant="outline">Pending</Badge>;
      case "declined": return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const totalContributions = contributions.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0);
  const verifiedCount = contributions.filter((c) => c.status === "approved").length;
  const pendingAmount = contributions.filter((c) => c.status === "pending").reduce((sum, c) => sum + c.amount, 0);
  const pendingCount = contributions.filter((c) => c.status === "pending").length;
  const declinedCount = contributions.filter((c) => c.status === "declined").length;
  
  // Flagging thresholds
  const FLAG_THRESHOLD = 3; // Flag user after 3 declined contributions
  const SUSPEND_THRESHOLD = 5; // Suspend user after 5 declined contributions
  
  const isFlagged = declinedCount >= FLAG_THRESHOLD;
  const isSuspended = declinedCount >= SUSPEND_THRESHOLD;
  
  // Update user flagged/suspended status in Firestore when declined count changes
  useEffect(() => {
    if (!user) return;
    
    const updateUserStatus = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          flagged: isFlagged,
          suspended: isSuspended,
          declinedContributionsCount: declinedCount
        });
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    };
    
    // Only update if we have contributions loaded
    if (contributions.length > 0 || !isLoadingContributions) {
      updateUserStatus();
    }
  }, [declinedCount, isFlagged, isSuspended, user, contributions.length, isLoadingContributions]);
  
  // Calculate this month's contributions
  const now = new Date();
  const thisMonthContributions = contributions.filter(c => {
    const contributionDate = c.date;
    return c.status === 'approved' && 
           contributionDate.getMonth() === now.getMonth() && 
           contributionDate.getFullYear() === now.getFullYear();
  });
  const thisMonthAmount = thisMonthContributions.reduce((sum, c) => sum + c.amount, 0);
  const thisMonthCount = thisMonthContributions.length;

  // Export contributions to CSV
  const exportToCSV = () => {
    if (contributions.length === 0) return;
    
    const headers = ['Date', 'Description', 'Amount (₦)', 'Status'];
    const rows = contributions.map(c => [
      c.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      c.description,
      c.amount.toString(),
      c.status.charAt(0).toUpperCase() + c.status.slice(1)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contributions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isAuthLoading || isLoadingContributions) {
      return <div className="flex items-center justify-center h-screen">Loading Dashboard...</div>
  }

  return (

    <div className="min-h-screen bg-background">
        <Header title="Contributions" subtitle="Track your contributions" />

        <main className="container mx-auto px-4 py-8">
            {/* Suspended Account Warning */}
            {isSuspended && (
              <Alert variant="destructive" className="mb-6">
                <Ban className="h-4 w-4" />
                <AlertTitle>Account Suspended</AlertTitle>
                <AlertDescription>
                  Your account has been suspended due to {declinedCount} declined contributions. 
                  You cannot log new contributions until this is resolved. 
                  Please contact support at support@zeroup.org for assistance.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Flagged Account Warning */}
            {isFlagged && !isSuspended && (
              <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800 dark:text-yellow-200">Account Under Review</AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                  Your account has been flagged due to {declinedCount} declined contributions. 
                  Please ensure all future contributions include valid proof of payment. 
                  {SUSPEND_THRESHOLD - declinedCount} more declined contributions will result in account suspension.
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-6">
                <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
            </div>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Verified</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{totalContributions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across {verifiedCount} contributions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{pendingAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{pendingCount} {pendingCount === 1 ? 'contribution' : 'contributions'} pending</p>
              </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    <Calendar className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₦{thisMonthAmount.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">{thisMonthCount} verified {thisMonthCount === 1 ? 'contribution' : 'contributions'} this month</p>
                </CardContent>
            </Card>

            <Card className={declinedCount >= FLAG_THRESHOLD ? "border-red-500" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Declined</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-500">{declinedCount}</div>
                    <p className="text-xs text-muted-foreground">
                      {declinedCount >= SUSPEND_THRESHOLD ? "Account suspended" : 
                       declinedCount >= FLAG_THRESHOLD ? "Account flagged" : 
                       "contributions declined"}
                    </p>
                </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center">
             <div>
              <h2 className="text-2xl font-bold">Your Contributions</h2>
              <p className="text-muted-foreground">View all your contributions and their status</p>
            </div>
            <div className="flex items-center gap-2">
              {contributions.length > 0 && (
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              )}
              {isSuspended ? (
                <Button disabled variant="destructive">
                  <Ban className="w-4 h-4 mr-2" />
                  Account Suspended
                </Button>
              ) : (
                <LogContributionModal />
              )}
            </div>
          </div>
          
          <div className="space-y-4">
              {contributions.length > 0 ? (
                  contributions.map((contribution, index) => (
                      <Card key={contribution.id}>
                      <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <div className="p-2 rounded-full bg-primary/10">
                                      {getStatusIcon(contribution.status)}
                                  </div>
                                  <div>
                                  <h3 className="font-semibold">{contribution.description}</h3>
                                  <p className="text-sm text-muted-foreground">
                                      {contribution.date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                  </p>
                                  {contribution.status === "declined" && contribution.rejectionReason && (
                                      <p className="text-sm text-red-500 mt-1"><b>Reason:</b> {contribution.rejectionReason}</p>
                                  )}
                                  </div>
                              </div>
                              <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-2xl font-bold">₦{contribution.amount.toLocaleString()}</p>
                                    {getStatusBadge(contribution.status)}
                                  </div>
                                  {contribution.proofURL &&
                                    <Button variant="outline" size="sm" asChild>
                                      <Link href={contribution.proofURL} target="_blank">
                                          <FileText className="w-4 h-4 mr-2" />
                                          View Proof
                                      </Link>
                                    </Button>
                                  }
                              </div>
                          </div>
                      </CardContent>
                      </Card>
                  ))
              ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No contributions logged yet.</p>
                  </div>
              )}
          </div>

        </div>
      </main>
    </div>
  )
}

export default function ContributionsPage() {
  return (
    <ProtectedRoute>
      <ContributionsContent />
    </ProtectedRoute>
  )
}
