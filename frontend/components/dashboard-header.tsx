"use client"

import React from "react"

import { Search, Bell, User, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { INITIAL_TEAMS } from "@/lib/data"

export function DashboardHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const [search, setSearch] = React.useState("")
  const [profileOpen, setProfileOpen] = React.useState(false)
  
  // Mock current user - in real app, this would come from auth context
  const currentUser = INITIAL_TEAMS[0].members[0] // Mitchell Admin

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/40 bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-muted-foreground hover:text-foreground">
                GearGuard
              </BreadcrumbLink>
            </BreadcrumbItem>
            {segments.length > 0 && <BreadcrumbSeparator />}
            {segments.map((segment, index) => (
              <React.Fragment key={segment}>
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize font-medium text-foreground">
                    {segment.replace(/-/g, " ")}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                {index < segments.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assets, requests..."
            className="w-72 bg-muted/50 pl-9 border-none focus-visible:ring-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full border border-border/50 bg-muted/30"
          onClick={() => setProfileOpen(true)}
        >
          <User className="h-5 w-5" />
        </Button>

        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>View your profile information and settings</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                    {currentUser.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentUser.role}</p>
                  <Badge 
                    variant={currentUser.status === "Active" ? "default" : "secondary"}
                    className="mt-1"
                  >
                    {currentUser.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Login ID</p>
                    <p className="text-sm text-muted-foreground">{currentUser.loginId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{currentUser.loginId}@gearguard.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Department</p>
                    <p className="text-sm text-muted-foreground">
                      {INITIAL_TEAMS.find(t => t.members.some(m => m.id === currentUser.id))?.name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Joined Date</p>
                    <p className="text-sm text-muted-foreground">January 15, 2024</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => setProfileOpen(false)}>
                  Close
                </Button>
                <Button variant="outline" className="flex-1">
                  Edit Profile
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
