"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, ClipboardList, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// <CHANGE> Added maintenance requests data to track team workload
const maintenanceRequests = [
  { id: "1", team: "Facility Management", title: "AC Unit Leakage", stage: "new", priority: "High" },
  { id: "2", team: "Internal Maintenance", title: "Conveyor Belt Calibration", stage: "in-progress", priority: "Medium" },
  { id: "3", team: "Internal Maintenance", title: "Hydraulic Fluid Replacement", stage: "new", priority: "Low" },
  { id: "4", team: "Electronics Specialist", title: "Laptop Screen Malfunction", stage: "scrap", priority: "High" },
  { id: "5", team: "Internal Maintenance", title: "Annual Safety Check", stage: "repaired", priority: "Medium" },
  { id: "6", team: "Electronics Specialist", title: "Monitor Display Issue", stage: "new", priority: "Medium" },
  { id: "7", team: "Internal Maintenance", title: "Server Maintenance", stage: "in-progress", priority: "High" },
  { id: "8", team: "Facility Management", title: "HVAC Filter Change", stage: "new", priority: "Low" },
]

const teams = [
  { name: "Internal Maintenance", lead: "Mitchell Admin", members: 12, company: "GearGuard Corp" },
  { name: "Electronics Specialist", lead: "Abigail Peterson", members: 4, company: "GearGuard Corp" },
  { name: "Facility Management", lead: "Max Foster", members: 8, company: "City Services" },
  { name: "Rapid Response", lead: "Sarah Connor", members: 6, company: "Internal" },
]

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [isRequestsDialogOpen, setIsRequestsDialogOpen] = useState(false)

  // <CHANGE> Function to get active maintenance requests count for team
  const getActiveRequestsCount = (teamName: string) => {
    return maintenanceRequests.filter(
      (req) => req.team === teamName && req.stage !== "repaired" && req.stage !== "scrap"
    ).length
  }

  // <CHANGE> Function to get all requests for selected team
  const getTeamRequests = (teamName: string) => {
    return maintenanceRequests.filter((req) => req.team === teamName)
  }

  const handleViewRequests = (teamName: string) => {
    setSelectedTeam(teamName)
    setIsRequestsDialogOpen(true)
  }

  const selectedTeamData = teams.find((team) => team.name === selectedTeam)
  const selectedRequests = selectedTeam ? getTeamRequests(selectedTeam) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Teams</h1>
          <p className="text-sm text-muted-foreground">Collaborate with internal and external maintenance units.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Team
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const activeCount = getActiveRequestsCount(team.name)
          return (
            <Card key={team.name} className="border-border/50 bg-card/30 hover:border-primary/50 transition-colors group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  {/* <CHANGE> Smart button with badge showing active requests */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-2 relative"
                    onClick={() => handleViewRequests(team.name)}
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    <span>View Requests</span>
                    {activeCount > 0 && (
                      <Badge className="ml-1 h-5 min-w-5 bg-primary text-primary-foreground border-none px-1.5">
                        {activeCount}
                      </Badge>
                    )}
                  </Button>
                </div>
                <CardTitle className="pt-4">{team.name}</CardTitle>
                <CardDescription>{team.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Team Lead</span>
                    <span className="font-medium">{team.lead}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Members</span>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px]"
                        >
                          U{i}
                        </div>
                      ))}
                      <div className="h-6 w-6 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] text-primary">
                        +{team.members - 3}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* <CHANGE> Dialog to show team's maintenance requests */}
      <Dialog open={isRequestsDialogOpen} onOpenChange={setIsRequestsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Team Maintenance Requests
            </DialogTitle>
            <DialogDescription>
              {selectedTeamData
                ? `All maintenance requests assigned to ${selectedTeamData.name}`
                : "Team maintenance requests"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {selectedRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No maintenance requests found for this team.</p>
              </div>
            ) : (
              selectedRequests.map((req) => (
                <Card key={req.id} className="border-border/50 bg-card/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{req.title}</p>
                          <Badge
                            variant="outline"
                            className={
                              req.priority === "High"
                                ? "bg-destructive/10 text-destructive border-destructive/20 text-[10px]"
                                : req.priority === "Medium"
                                  ? "bg-chart-2/10 text-chart-2 border-chart-2/20 text-[10px]"
                                  : "bg-muted/50 text-muted-foreground border-transparent text-[10px]"
                            }
                          >
                            {req.priority}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Request ID: {req.id}</p>
                      </div>
                      <Badge
                        className={
                          req.stage === "new"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : req.stage === "in-progress"
                              ? "bg-chart-2/10 text-chart-2 border-chart-2/20"
                              : req.stage === "repaired"
                                ? "bg-chart-2/10 text-chart-2 border-chart-2/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {req.stage === "in-progress" ? "In Progress" : req.stage.charAt(0).toUpperCase() + req.stage.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
