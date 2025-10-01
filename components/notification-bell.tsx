"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function NotificationBell() {
  // Mock notification count
  const unreadCount = 3

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="cursor-pointer">
            <div className="space-y-1">
              <p className="font-medium">New Badge Earned!</p>
              <p className="text-sm text-muted-foreground">You've earned the 'Consistent Contributor' badge</p>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="cursor-pointer">
            <div className="space-y-1">
              <p className="font-medium">Contribution Verified</p>
              <p className="text-sm text-muted-foreground">Your March contribution has been verified</p>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="cursor-pointer w-full text-center">
            View All Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
