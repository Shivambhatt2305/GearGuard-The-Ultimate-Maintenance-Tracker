// Shared data structures for the maintenance tracker system

export type WorkOrderStatus = "new" | "in-progress" | "repaired" | "scrap"
export type Priority = "High" | "Medium" | "Low"
export type MaintenanceType = "Corrective" | "Preventive"
export type MemberRole = "Technician" | "Team Lead" | "Supervisor" | "Admin" | "Manager"
export type MemberStatus = "Active" | "Inactive"
export type AssetStatus = "Operational" | "Under Repair" | "Maintenance" | "Retired"
export type MaintenanceFrequency = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly" | "Custom"

// User / Team Member
export interface TeamMember {
  id: string
  name: string
  loginId: string
  email: string
  role: MemberRole
  status: MemberStatus
  teamId: string
  phone?: string
  joinedDate?: string
}

// Team
export interface Team {
  id: string
  name: string
  company: string
  members: TeamMember[]
}

// Equipment / Asset
export interface Equipment {
  id: string
  name: string
  serialNumber: string
  category: string
  manufacturer?: string
  model?: string
  status: AssetStatus
  technician: string
  company: string
  purchaseDate: string
  warrantyExpiry: string
  location: string
  workCenterId?: string
  maintenanceHistory?: string[] // Array of maintenance log IDs
  totalMaintenanceCost?: number
  lastMaintenanceDate?: string
}

// Maintenance Schedule
export interface MaintenanceSchedule {
  id: string
  assetId: string
  assetName: string
  maintenanceType: MaintenanceType
  frequency: MaintenanceFrequency
  customFrequencyDays?: number
  nextServiceDate: string
  assignedTechnician?: string
  notes?: string
  isActive: boolean
  createdAt: string
}

// Maintenance Log
export interface MaintenanceLog {
  id: string
  assetId: string
  assetName: string
  maintenanceDate: string
  technicianName: string
  technicianId: string
  workDescription: string
  maintenanceType: MaintenanceType
  sparePartsUsed: SparePartUsage[]
  laborCost: number
  partsCost: number
  totalCost: number
  status: "Completed" | "Pending" | "In Progress"
  documentsUrl?: string[]
  notes?: string
  createdBy: string
  createdAt: string
}

// Spare Part Usage
export interface SparePartUsage {
  partId: string
  partName: string
  quantityUsed: number
  costPerUnit: number
}

// Inventory / Spare Parts
export interface SparePart {
  id: string
  partName: string
  partNumber: string
  category: string
  quantityAvailable: number
  minimumThreshold: number
  costPerUnit: number
  supplierId?: string
  supplierName?: string
  location?: string
  lastRestocked?: string
}

// Vendor / Service Provider
export interface Vendor {
  id: string
  vendorName: string
  contactPerson: string
  phoneNumber: string
  email: string
  address: string
  serviceCategory: string[]
  contractValidity?: string
  rating?: number
  isActive: boolean
  createdAt: string
}

// Notification
export interface Notification {
  id: string
  type: "maintenance_due" | "overdue" | "low_stock" | "warranty_expiry"
  title: string
  message: string
  relatedId: string // Asset ID, Part ID, etc.
  isRead: boolean
  createdAt: string
  priority: Priority
}

// Work Order / Maintenance Request
export interface WorkOrder {
  id: string
  title: string
  description?: string
  equipmentId: string
  equipmentName: string
  category: string
  teamId: string
  teamName: string
  assignedTo?: string // Team member login ID
  priority: Priority
  type: MaintenanceType
  status: WorkOrderStatus
  scheduledDate?: string
  startDate?: string
  completedDate?: string
  estimatedHours?: number
  actualHours?: number
  createdBy: string
  createdAt: string
  notes?: string
  sparePartsUsed?: SparePartUsage[]
  totalCost?: number
}

// Work Center
export interface WorkCenter {
  code: string
  tag: string
  alternative: string
  costPerHour: number
  capacity: number
  efficiency: number
  oeeTarget: number
}

// Initial data
export const INITIAL_TEAMS: Team[] = [
  {
    id: "team-1",
    name: "Facility Management",
    company: "City Services",
    members: [
      { id: "m1", name: "Max Foster", loginId: "max.foster", email: "max.foster@gearguard.com", role: "Team Lead", status: "Active", teamId: "team-1", phone: "+1-555-0101", joinedDate: "2023-01-15" },
      { id: "m2", name: "Sarah Johnson", loginId: "sarah.j", email: "sarah.j@gearguard.com", role: "Technician", status: "Active", teamId: "team-1", phone: "+1-555-0102", joinedDate: "2023-03-20" },
      { id: "m3", name: "David Chen", loginId: "david.chen", email: "david.chen@gearguard.com", role: "Technician", status: "Active", teamId: "team-1", phone: "+1-555-0103", joinedDate: "2023-05-10" },
    ],
  },
  {
    id: "team-2",
    name: "Internal Maintenance",
    company: "GearGuard Corp",
    members: [
      { id: "m4", name: "Mitchell Admin", loginId: "mitchell.admin", email: "mitchell.admin@gearguard.com", role: "Admin", status: "Active", teamId: "team-2", phone: "+1-555-0104", joinedDate: "2022-06-01" },
      { id: "m5", name: "John Smith", loginId: "john.smith", email: "john.smith@gearguard.com", role: "Team Lead", status: "Active", teamId: "team-2", phone: "+1-555-0105", joinedDate: "2023-02-14" },
      { id: "m6", name: "Emily Davis", loginId: "emily.d", email: "emily.d@gearguard.com", role: "Technician", status: "Active", teamId: "team-2", phone: "+1-555-0106", joinedDate: "2023-07-22" },
      { id: "m7", name: "Robert Brown", loginId: "robert.b", email: "robert.b@gearguard.com", role: "Technician", status: "Inactive", teamId: "team-2", phone: "+1-555-0107", joinedDate: "2022-11-30" },
    ],
  },
  {
    id: "team-3",
    name: "Electronics Specialist",
    company: "GearGuard Corp",
    members: [
      { id: "m8", name: "Abigail Peterson", loginId: "abigail.p", email: "abigail.p@gearguard.com", role: "Team Lead", status: "Active", teamId: "team-3", phone: "+1-555-0108", joinedDate: "2023-01-08" },
      { id: "m9", name: "Michael Wilson", loginId: "michael.w", email: "michael.w@gearguard.com", role: "Technician", status: "Active", teamId: "team-3", phone: "+1-555-0109", joinedDate: "2023-04-17" },
    ],
  },
]

export const EQUIPMENT_DATABASE: Equipment[] = [
  {
    id: "EQ-101",
    name: 'Samsung Monitor 15"',
    serialNumber: "SM-2024-001",
    category: "Monitors",
    status: "Operational",
    technician: "Mitchell Admin",
    company: "GearGuard Corp",
    purchaseDate: "2022-03-15",
    warrantyExpiry: "2025-03-15",
    location: "Building A, Floor 2, Desk 201",
  },
  {
    id: "EQ-102",
    name: "Acer Laptop X5",
    serialNumber: "AL-2024-002",
    category: "Laptops",
    status: "Retired",
    technician: "Abigail Peterson",
    company: "GearGuard Corp",
    purchaseDate: "2021-06-20",
    warrantyExpiry: "2024-06-20",
    location: "Storage Room, Shelf B3",
  },
  {
    id: "EQ-103",
    name: "Dell Server R740",
    serialNumber: "DS-2024-003",
    category: "Servers",
    status: "Maintenance",
    technician: "Mitchell Admin",
    company: "DataCenter Ltd",
    purchaseDate: "2020-09-10",
    warrantyExpiry: "2026-09-10",
    location: "Data Center, Rack 5, Unit 3",
  },
  {
    id: "EQ-104",
    name: "HP Laserjet Pro",
    serialNumber: "HP-2024-004",
    category: "Printers",
    status: "Operational",
    technician: "Abigail Peterson",
    company: "GearGuard Corp",
    purchaseDate: "2022-11-05",
    warrantyExpiry: "2025-11-05",
    location: "Building B, Floor 1, Print Room",
  },
  {
    id: "EQ-105",
    name: "Assembly Line 02",
    serialNumber: "AL-2024-005",
    category: "Production Equipment",
    status: "Maintenance",
    technician: "Max Foster",
    company: "GearGuard Corp",
    purchaseDate: "2019-01-22",
    warrantyExpiry: "2027-01-22",
    location: "Factory Floor, Zone C",
    workCenterId: "WC-01",
  },
  {
    id: "EQ-106",
    name: "Forklift H2",
    serialNumber: "FK-2024-006",
    category: "Material Handling",
    status: "Operational",
    technician: "Mitchell Admin",
    company: "GearGuard Corp",
    purchaseDate: "2020-04-18",
    warrantyExpiry: "2026-04-18",
    location: "Warehouse, Level 1, Section A",
  },
  {
    id: "EQ-107",
    name: "HVAC Unit PM-04",
    serialNumber: "HV-2024-007",
    category: "HVAC Systems",
    status: "Under Repair",
    technician: "Max Foster",
    company: "GearGuard Corp",
    purchaseDate: "2018-07-30",
    warrantyExpiry: "2024-07-30",
    location: "Building A, Roof, Unit 04",
  },
  {
    id: "EQ-108",
    name: "CNC Machine X1",
    serialNumber: "CN-2024-008",
    category: "Production Equipment",
    status: "Operational",
    technician: "Mitchell Admin",
    company: "GearGuard Corp",
    purchaseDate: "2021-02-14",
    warrantyExpiry: "2027-02-14",
    location: "Factory Floor, Zone A",
    workCenterId: "WC-02",
  },
]

export const WORK_CENTERS: WorkCenter[] = [
  {
    code: "WC-01",
    tag: "Assembly 1",
    alternative: "WC-02",
    costPerHour: 45.0,
    capacity: 100,
    efficiency: 92.5,
    oeeTarget: 85.0,
  },
  {
    code: "WC-02",
    tag: "Drill 1",
    alternative: "WC-01",
    costPerHour: 65.0,
    capacity: 100,
    efficiency: 88.0,
    oeeTarget: 90.0,
  },
  {
    code: "WC-03",
    tag: "Packaging",
    alternative: "None",
    costPerHour: 30.0,
    capacity: 120,
    efficiency: 95.0,
    oeeTarget: 92.0,
  },
]

// Spare Parts Inventory
export const SPARE_PARTS: SparePart[] = [
  {
    id: "SP-001",
    partName: "Air Filter",
    partNumber: "AF-2024-001",
    category: "HVAC",
    quantityAvailable: 15,
    minimumThreshold: 5,
    costPerUnit: 25.50,
    supplierName: "HVAC Supplies Inc",
    location: "Warehouse A, Shelf 3",
    lastRestocked: "2025-12-01",
  },
  {
    id: "SP-002",
    partName: "Hydraulic Oil",
    partNumber: "HO-2024-002",
    category: "Fluids",
    quantityAvailable: 8,
    minimumThreshold: 10,
    costPerUnit: 45.00,
    supplierName: "Industrial Fluids Co",
    location: "Warehouse B, Section 2",
    lastRestocked: "2025-11-15",
  },
  {
    id: "SP-003",
    partName: "Conveyor Belt",
    partNumber: "CB-2024-003",
    category: "Production",
    quantityAvailable: 3,
    minimumThreshold: 2,
    costPerUnit: 320.00,
    supplierName: "Belt Systems Ltd",
    location: "Warehouse A, Shelf 7",
    lastRestocked: "2025-10-20",
  },
  {
    id: "SP-004",
    partName: "Motor Bearing",
    partNumber: "MB-2024-004",
    category: "Mechanical",
    quantityAvailable: 25,
    minimumThreshold: 10,
    costPerUnit: 12.75,
    supplierName: "Precision Parts Inc",
    location: "Warehouse A, Shelf 5",
    lastRestocked: "2025-12-10",
  },
  {
    id: "SP-005",
    partName: "Cooling Fan",
    partNumber: "CF-2024-005",
    category: "Electronics",
    quantityAvailable: 7,
    minimumThreshold: 5,
    costPerUnit: 18.50,
    supplierName: "Tech Components Ltd",
    location: "Warehouse C, Shelf 2",
    lastRestocked: "2025-11-28",
  },
]

// Vendors / Service Providers
export const VENDORS: Vendor[] = [
  {
    id: "V-001",
    vendorName: "HVAC Supplies Inc",
    contactPerson: "Robert Martinez",
    phoneNumber: "+1-555-2001",
    email: "robert@hvacsupplies.com",
    address: "123 Industrial Blvd, Tech City, TC 12345",
    serviceCategory: ["HVAC", "Air Conditioning", "Ventilation"],
    contractValidity: "2026-12-31",
    rating: 4.5,
    isActive: true,
    createdAt: "2023-01-15",
  },
  {
    id: "V-002",
    vendorName: "Industrial Fluids Co",
    contactPerson: "Amanda Johnson",
    phoneNumber: "+1-555-2002",
    email: "amanda@industrialfluids.com",
    address: "456 Chemical Ave, Tech City, TC 12346",
    serviceCategory: ["Fluids", "Lubricants", "Coolants"],
    contractValidity: "2026-06-30",
    rating: 4.8,
    isActive: true,
    createdAt: "2023-02-10",
  },
  {
    id: "V-003",
    vendorName: "Belt Systems Ltd",
    contactPerson: "David Thompson",
    phoneNumber: "+1-555-2003",
    email: "david@beltsystems.com",
    address: "789 Manufacturing Dr, Tech City, TC 12347",
    serviceCategory: ["Production Equipment", "Conveyors", "Belts"],
    contractValidity: "2025-12-31",
    rating: 4.2,
    isActive: true,
    createdAt: "2023-03-05",
  },
  {
    id: "V-004",
    vendorName: "Precision Parts Inc",
    contactPerson: "Lisa Anderson",
    phoneNumber: "+1-555-2004",
    email: "lisa@precisionparts.com",
    address: "321 Parts Way, Tech City, TC 12348",
    serviceCategory: ["Mechanical Parts", "Bearings", "Gears"],
    contractValidity: "2026-03-31",
    rating: 4.7,
    isActive: true,
    createdAt: "2023-01-20",
  },
  {
    id: "V-005",
    vendorName: "Tech Components Ltd",
    contactPerson: "Michael Chen",
    phoneNumber: "+1-555-2005",
    email: "michael@techcomponents.com",
    address: "654 Electronics Rd, Tech City, TC 12349",
    serviceCategory: ["Electronics", "IT Equipment", "Components"],
    contractValidity: "2026-09-30",
    rating: 4.6,
    isActive: true,
    createdAt: "2023-04-12",
  },
]

// Maintenance Schedules
export const MAINTENANCE_SCHEDULES: MaintenanceSchedule[] = [
  {
    id: "MS-001",
    assetId: "EQ-107",
    assetName: "HVAC Unit PM-04",
    maintenanceType: "Preventive",
    frequency: "Monthly",
    nextServiceDate: "2026-01-15",
    assignedTechnician: "max.foster",
    notes: "Check filters and coolant levels",
    isActive: true,
    createdAt: "2025-01-01",
  },
  {
    id: "MS-002",
    assetId: "EQ-105",
    assetName: "Assembly Line 02",
    maintenanceType: "Preventive",
    frequency: "Weekly",
    nextServiceDate: "2025-12-30",
    assignedTechnician: "john.smith",
    notes: "Lubrication and calibration check",
    isActive: true,
    createdAt: "2025-01-01",
  },
  {
    id: "MS-003",
    assetId: "EQ-103",
    assetName: "Dell Server R740",
    maintenanceType: "Preventive",
    frequency: "Quarterly",
    nextServiceDate: "2026-03-01",
    assignedTechnician: "mitchell.admin",
    notes: "Hardware diagnostics and cooling system check",
    isActive: true,
    createdAt: "2025-01-01",
  },
]

// Maintenance Logs
export const MAINTENANCE_LOGS: MaintenanceLog[] = [
  {
    id: "ML-001",
    assetId: "EQ-107",
    assetName: "HVAC Unit PM-04",
    maintenanceDate: "2025-12-15",
    technicianName: "Max Foster",
    technicianId: "max.foster",
    workDescription: "Replaced air filters and refilled coolant. System running optimally.",
    maintenanceType: "Preventive",
    sparePartsUsed: [
      { partId: "SP-001", partName: "Air Filter", quantityUsed: 2, costPerUnit: 25.50 }
    ],
    laborCost: 85.00,
    partsCost: 51.00,
    totalCost: 136.00,
    status: "Completed",
    notes: "No issues found. Next maintenance due in 30 days.",
    createdBy: "max.foster",
    createdAt: "2025-12-15",
  },
  {
    id: "ML-002",
    assetId: "EQ-106",
    assetName: "Forklift H2",
    maintenanceDate: "2025-12-20",
    technicianName: "John Smith",
    technicianId: "john.smith",
    workDescription: "Replaced hydraulic oil and checked brake system.",
    maintenanceType: "Corrective",
    sparePartsUsed: [
      { partId: "SP-002", partName: "Hydraulic Oil", quantityUsed: 3, costPerUnit: 45.00 }
    ],
    laborCost: 120.00,
    partsCost: 135.00,
    totalCost: 255.00,
    status: "Completed",
    notes: "Brake pads at 40% wear, recommend replacement in 3 months.",
    createdBy: "john.smith",
    createdAt: "2025-12-20",
  },
  {
    id: "ML-003",
    assetId: "EQ-105",
    assetName: "Assembly Line 02",
    maintenanceDate: "2025-12-23",
    technicianName: "Emily Davis",
    technicianId: "emily.d",
    workDescription: "Calibration and bearing replacement on conveyor motor.",
    maintenanceType: "Preventive",
    sparePartsUsed: [
      { partId: "SP-004", partName: "Motor Bearing", quantityUsed: 4, costPerUnit: 12.75 }
    ],
    laborCost: 95.00,
    partsCost: 51.00,
    totalCost: 146.00,
    status: "Completed",
    notes: "Belt tension adjusted. System running smoothly.",
    createdBy: "emily.d",
    createdAt: "2025-12-23",
  },
]

// Notifications
export const NOTIFICATIONS: Notification[] = [
  {
    id: "N-001",
    type: "maintenance_due",
    title: "Maintenance Due: Assembly Line 02",
    message: "Preventive maintenance scheduled for December 30, 2025",
    relatedId: "EQ-105",
    isRead: false,
    createdAt: "2025-12-27",
    priority: "Medium",
  },
  {
    id: "N-002",
    type: "low_stock",
    title: "Low Stock Alert: Hydraulic Oil",
    message: "Hydraulic Oil quantity (8) is below minimum threshold (10)",
    relatedId: "SP-002",
    isRead: false,
    createdAt: "2025-12-26",
    priority: "High",
  },
  {
    id: "N-003",
    type: "warranty_expiry",
    title: "Warranty Expiring: HP Laserjet Pro",
    message: "Warranty expires on November 5, 2025",
    relatedId: "EQ-104",
    isRead: true,
    createdAt: "2025-12-20",
    priority: "Low",
  },
  {
    id: "N-004",
    type: "overdue",
    title: "Overdue Maintenance: HVAC Unit PM-04",
    message: "Maintenance was due on December 15, 2025",
    relatedId: "MS-001",
    isRead: false,
    createdAt: "2025-12-27",
    priority: "High",
  },
]

// Helper function to get team by equipment category
export function getTeamForEquipment(category: string): Team | undefined {
  const categoryToTeam: Record<string, string> = {
    "Monitors": "team-3",
    "Laptops": "team-3",
    "Servers": "team-2",
    "Printers": "team-3",
    "Production Equipment": "team-2",
    "Material Handling": "team-2",
    "HVAC Systems": "team-1",
  }
  
  const teamId = categoryToTeam[category]
  return INITIAL_TEAMS.find(t => t.id === teamId)
}

// Helper to get active team members
export function getActiveMembers(teamId: string): TeamMember[] {
  const team = INITIAL_TEAMS.find(t => t.id === teamId)
  return team?.members.filter(m => m.status === "Active") || []
}

// Helper to get all active members across all teams
export function getAllActiveMembers(): TeamMember[] {
  return INITIAL_TEAMS.flatMap(team => team.members.filter(m => m.status === "Active"))
}

// Helper to get spare parts below minimum threshold
export function getLowStockParts(): SparePart[] {
  return SPARE_PARTS.filter(part => part.quantityAvailable < part.minimumThreshold)
}

// Helper to get unread notifications
export function getUnreadNotifications(): Notification[] {
  return NOTIFICATIONS.filter(n => !n.isRead)
}

// Helper to calculate total maintenance cost for an asset
export function getAssetMaintenanceCost(assetId: string): number {
  return MAINTENANCE_LOGS
    .filter(log => log.assetId === assetId && log.status === "Completed")
    .reduce((total, log) => total + log.totalCost, 0)
}

// Helper to get upcoming maintenance schedules (next 7 days)
export function getUpcomingMaintenance(): MaintenanceSchedule[] {
  const today = new Date()
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  return MAINTENANCE_SCHEDULES.filter(schedule => {
    const scheduleDate = new Date(schedule.nextServiceDate)
    return schedule.isActive && scheduleDate >= today && scheduleDate <= weekFromNow
  })
}

// Helper to get overdue maintenance
export function getOverdueMaintenance(): MaintenanceSchedule[] {
  const today = new Date()
  
  return MAINTENANCE_SCHEDULES.filter(schedule => {
    const scheduleDate = new Date(schedule.nextServiceDate)
    return schedule.isActive && scheduleDate < today
  })
}

// Helper to get maintenance history for an asset
export function getAssetMaintenanceHistory(assetId: string): MaintenanceLog[] {
  return MAINTENANCE_LOGS.filter(log => log.assetId === assetId)
    .sort((a, b) => new Date(b.maintenanceDate).getTime() - new Date(a.maintenanceDate).getTime())
}

// Helper to get vendor by ID
export function getVendorById(vendorId: string): Vendor | undefined {
  return VENDORS.find(v => v.id === vendorId)
}

// Helper to get spare part by ID
export function getSparePartById(partId: string): SparePart | undefined {
  return SPARE_PARTS.find(p => p.id === partId)
}
