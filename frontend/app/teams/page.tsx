"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, UserPlus, ClipboardList, AlertCircle, Trash2, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// Team member type
type TeamMember = {
  id: string
  name: string
  loginId: string
  role: "Technician" | "Team Lead" | "Supervisor"
  status: "Active" | "Inactive"
  teamId: string
}
// Team type
type Team = {
  id: string
  name: string
  company: string
  members: TeamMember[]
}
// <CHANGE> Added maintenance requests data to track team workload
const maintenanceRequests = [
  { id: "1", teamId: "team-1", title: "AC Unit Leakage", stage: "new", priority: "High" },
  { id: "2", teamId: "team-2", title: "Conveyor Belt Calibration", stage: "in-progress", priority: "Medium" },
  { id: "3", teamId: "team-2", title: "Hydraulic Fluid Replacement", stage: "new", priority: "Low" },
  { id: "4", teamId: "team-3", title: "Laptop Screen Malfunction", stage: "scrap", priority: "High" },
  { id: "5", teamId: "team-2", title: "Annual Safety Check", stage: "repaired", priority: "Medium" },
  { id: "6", teamId: "team-3", title: "Monitor Display Issue", stage: "new", priority: "Medium" },
  { id: "7", teamId: "team-2", title: "Server Maintenance", stage: "in-progress", priority: "High" },
  { id: "8", teamId: "team-1", title: "HVAC Filter Change", stage: "new", priority: "Low" },
]
const initialTeams: Team[] = [
  {
    id: "team-1",
    name: "Facility Management",
    company: "City Services",
    members: [
      { id: "m1", name: "Max Foster", loginId: "max.foster", role: "Team Lead", status: "Active", teamId: "team-1" },
      { id: "m2", name: "Sarah Johnson", loginId: "sarah.j", role: "Technician", status: "Active", teamId: "team-1" },
      { id: "m3", name: "David Chen", loginId: "david.chen", role: "Technician", status: "Active", teamId: "team-1" },
    ],
  },
  {
    id: "team-2",
    name: "Internal Maintenance",
    company: "GearGuard Corp",
    members: [
      { id: "m4", name: "Mitchell Admin", loginId: "mitchell.admin", role: "Supervisor", status: "Active", teamId: "team-2" },
      { id: "m5", name: "John Smith", loginId: "john.smith", role: "Team Lead", status: "Active", teamId: "team-2" },
      { id: "m6", name: "Emily Davis", loginId: "emily.d", role: "Technician", status: "Active", teamId: "team-2" },
      { id: "m7", name: "Robert Brown", loginId: "robert.b", role: "Technician", status: "Inactive", teamId: "team-2" },
    ],
  },
  {
    id: "team-3",
    name: "Electronics Specialist",
    company: "GearGuard Corp",
    members: [
      { id: "m8", name: "Abigail Peterson", loginId: "abigail.p", role: "Team Lead", status: "Active", teamId: "team-3" },
      { id: "m9", name: "Michael Wilson", loginId: "michael.w", role: "Technician", status: "Active", teamId: "team-3" },
    ],
  },
]
export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [isRequestsDialogOpen, setIsRequestsDialogOpen] = useState(false)
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [isViewMembersDialogOpen, setIsViewMembersDialogOpen] = useState(false)
  // Form states for new team
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamCompany, setNewTeamCompany] = useState("")
  // Form states for new member
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberLoginId, setNewMemberLoginId] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<"Technician" | "Team Lead" | "Supervisor">("Technician")
  const [newMemberStatus, setNewMemberStatus] = useState<"Active" | "Inactive">("Active")
  const [newMemberTeamId, setNewMemberTeamId] = useState("")
  // <CHANGE> Function to get active maintenance requests count for team
  const getActiveRequestsCount = (teamId: string) => {
    return maintenanceRequests.filter(
      (req) => req.teamId === teamId && req.stage !== "repaired" && req.stage !== "scrap"
    ).length
  }
  // <CHANGE> Function to get all requests for selected team
  const getTeamRequests = (teamId: string) => {
    return maintenanceRequests.filter((req) => req.teamId === teamId)
  }
  const handleViewRequests = (teamId: string) => {
    setSelectedTeam(teamId)
    setIsRequestsDialogOpen(true)
  }
  const handleViewMembers = (teamId: string) => {
    setSelectedTeam(teamId)
    setIsViewMembersDialogOpen(true)
  }

  const handleAddTeam = () => {
    if (!newTeamName.trim() || !newTeamCompany.trim()) return
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      company: newTeamCompany,
      members: [],
    }
    setTeams([...teams, newTeam])
    setNewTeamName("")
    setNewTeamCompany("")
    setIsAddTeamDialogOpen(false)
  }
  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberLoginId.trim() || !newMemberTeamId) return
    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: newMemberName,
      loginId: newMemberLoginId,
      role: newMemberRole,
      status: newMemberStatus,
      teamId: newMemberTeamId,
    }
    setTeams(
      teams.map((team) =>
        team.id === newMemberTeamId ? { ...team, members: [...team.members, newMember] } : team
      )
    )
    // Reset form
    setNewMemberName("")
    setNewMemberLoginId("")
    setNewMemberRole("Technician")
    setNewMemberStatus("Active")
    setNewMemberTeamId("")
    setIsAddMemberDialogOpen(false)
  }
  const handleDeleteMember = (teamId: string, memberId: string) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? { ...team, members: team.members.filter((m) => m.id !== memberId) }
          : team
      )
    )
  }
  const handleToggleMemberStatus = (teamId: string, memberId: string) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: team.members.map((m) =>
                m.id === memberId ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" } : m
              ),
            }
          : team
      )
    )
  }

  const selectedTeamData = teams.find((team) => team.id === selectedTeam)
  const selectedRequests = selectedTeam ? getTeamRequests(selectedTeam) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Teams</h1>
          <p className="text-sm text-muted-foreground">Collaborate with internal and external maintenance units.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setIsAddMemberDialogOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
          <Button className="gap-2" onClick={() => setIsAddTeamDialogOpen(true)}>
            <Users className="h-4 w-4" />
            Add Team
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const activeCount = getActiveRequestsCount(team.id)
          const activeMembers = team.members.filter((m) => m.status === "Active").length
          const teamLead = team.members.find((m) => m.role === "Team Lead" || m.role === "Supervisor")
          return (
            <Card key={team.id} className="border-border/50 bg-card/30 hover:border-primary/50 transition-colors group">
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
                    onClick={() => handleViewRequests(team.id)}
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    <span>Requests</span>
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
                    <span className="font-medium">{teamLead?.name || "Not assigned"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Members</span>
                    <Badge variant="outline" className="font-normal">
                      {activeMembers} / {team.members.length}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => handleViewMembers(team.id)}
                  >
                    View Team Members
                  </Button>
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

      {/* Add Team Dialog */}
      <Dialog open={isAddTeamDialogOpen} onOpenChange={setIsAddTeamDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Team</DialogTitle>
            <DialogDescription>Create a new maintenance team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name *</Label>
              <Input
                id="teamName"
                placeholder="e.g., Electrical Team, IT Support"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamCompany">Company *</Label>
              <Input
                id="teamCompany"
                placeholder="e.g., GearGuard Corp, External Vendor"
                value={newTeamCompany}
                onChange={(e) => setNewTeamCompany(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTeamDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTeam} disabled={!newTeamName.trim() || !newTeamCompany.trim()}>
              Add Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Add a new member to a maintenance team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="memberTeam">Assigned Team *</Label>
              <Select value={newMemberTeamId} onValueChange={setNewMemberTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberName">Full Name *</Label>
              <Input
                id="memberName"
                placeholder="e.g., John Smith"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberLoginId">System User / Login ID *</Label>
              <Input
                id="memberLoginId"
                placeholder="e.g., john.smith"
                value={newMemberLoginId}
                onChange={(e) => setNewMemberLoginId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberRole">Role *</Label>
              <Select value={newMemberRole} onValueChange={(val) => setNewMemberRole(val as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Team Lead">Team Lead</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberStatus">Status *</Label>
              <Select value={newMemberStatus} onValueChange={(val) => setNewMemberStatus(val as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              disabled={!newMemberName.trim() || !newMemberLoginId.trim() || !newMemberTeamId}
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Team Members Dialog */}
      <Dialog open={isViewMembersDialogOpen} onOpenChange={setIsViewMembersDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Team Members</DialogTitle>
            <DialogDescription>
              {selectedTeamData ? `Members of ${selectedTeamData.name}` : "Team members"}
            </DialogDescription>
          </DialogHeader>
          {selectedTeamData && (
            <div className="space-y-4">
              {selectedTeamData.members.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No members in this team yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Login ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTeamData.members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell className="font-mono text-sm">{member.loginId}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              member.status === "Active"
                                ? "bg-chart-2/15 text-chart-2 border-chart-2/20"
                                : "bg-muted/50 text-muted-foreground"
                            }
                          >
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleMemberStatus(selectedTeamData.id, member.id)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteMember(selectedTeamData.id, member.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
