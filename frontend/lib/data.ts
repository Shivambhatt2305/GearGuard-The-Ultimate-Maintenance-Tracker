export type TeamMember = {
  id: string
  name: string
  loginId: string
  role: "Technician" | "Team Lead" | "Supervisor"
  status: "Active" | "Inactive"
  teamId: string
}

export type Team = {
  id: string
  name: string
  company: string
  members: TeamMember[]
}

export type WorkOrder = {
  id: string
  title: string
  description?: string
  equipmentId?: string
  equipmentName?: string
  category?: string
  teamId?: string
  teamName?: string
  assignedTo?: string
  priority?: "High" | "Medium" | "Low"
  type?: "Corrective" | "Preventive"
  status?: "new" | "in-progress" | "repaired" | "scrap"
  scheduledDate?: string
  scheduledTime?: string
  startDate?: string
  completedDate?: string
  estimatedHours?: number
  actualHours?: number
  createdBy?: string
  createdAt?: string
  notes?: string
}

export const INITIAL_TEAMS: Team[] = [
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

export const EQUIPMENT_DATABASE = [
  { id: "EQ-102", name: "Acer Laptop X5", category: "Laptops", serialNumber: "SN-LAP-102", company: "GearGuard Corp" },
  { id: "EQ-105", name: "Assembly Line 02", category: "Production Equipment", serialNumber: "SN-ASM-105", company: "GearGuard Corp" },
  { id: "EQ-106", name: "Forklift H2", category: "Material Handling", serialNumber: "SN-FLK-106", company: "GearGuard Corp" },
  { id: "EQ-107", name: "HVAC Unit PM-04", category: "HVAC Systems", serialNumber: "SN-HVAC-107", company: "City Services" },
  { id: "EQ-108", name: "CNC Machine X1", category: "Production Equipment", serialNumber: "SN-CNC-108", company: "GearGuard Corp" },
]

export function getTeamForEquipment(_equipmentId?: string) {
  // simple placeholder: returns team-2 for production equipment, team-1 for facility items
  if (!_equipmentId) return null
  if (_equipmentId.startsWith("EQ-10") || _equipmentId.startsWith("EQ-11")) return INITIAL_TEAMS[1]
  return INITIAL_TEAMS[0]
}

export function getActiveMembers(teamId: string) {
  const team = INITIAL_TEAMS.find((t) => t.id === teamId)
  if (!team) return []
  return team.members.filter((m) => m.status === "Active")
}
