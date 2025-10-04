'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';

interface UserProfile {
  firstName: string;
  lastName: string;
  organization?: string;
  // Add any other user profile fields you have in Firestore
}

interface AuthContextType {
  user: (FirebaseUser & UserProfile) | null;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<(FirebaseUser & UserProfile) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If the user is authenticated, fetch their profile from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userProfile = userDoc.data() as UserProfile;
          setUser({ ...firebaseUser, ...userProfile });
        } else {
          // Handle case where user exists in Auth but not in Firestore
          setUser(firebaseUser as (FirebaseUser & UserProfile)); // Or handle as an error
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }, (error) => {
      setError(error.message);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
