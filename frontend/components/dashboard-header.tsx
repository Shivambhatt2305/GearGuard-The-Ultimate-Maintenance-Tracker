"use client"

import React from "react"

import { Search, Bell, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

export function DashboardHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const [search, setSearch] = React.useState("")

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
        <Button variant="ghost" size="icon" className="rounded-full border border-border/50 bg-muted/30">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
