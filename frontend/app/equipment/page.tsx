"use client"


import { Suspense, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, Plus, Wrench, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { INITIAL_TEAMS, type Equipment } from "@/lib/data"

// <CHANGE> Added maintenance tasks data structure to track requests per equipment
const maintenanceRequests = [
  { id: "1", equipmentId: "EQ-107", title: "AC Unit Leakage", stage: "new", priority: "High" },
  { id: "2", equipmentId: "EQ-105", title: "Conveyor Belt Calibration", stage: "in-progress", priority: "Medium" },
  { id: "3", equipmentId: "EQ-106", title: "Hydraulic Fluid Replacement", stage: "new", priority: "Low" },
  { id: "4", equipmentId: "EQ-102", title: "Laptop Screen Malfunction", stage: "scrap", priority: "High" },
  { id: "5", equipmentId: "EQ-108", title: "Annual Safety Check", stage: "repaired", priority: "Medium" },
  { id: "6", equipmentId: "EQ-101", title: "Monitor Display Issue", stage: "new", priority: "Medium" },
  { id: "7", equipmentId: "EQ-103", title: "Server Maintenance", stage: "in-progress", priority: "High" },
]

const equipment = [
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
    status: "Scrapped",
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
  },
]

export default function EquipmentPage() {
  return (
    <Suspense fallback={null}>
      <EquipmentContent />
    </Suspense>
  )
}

function EquipmentContent() {
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [equipmentList, setEquipmentList] = useState(equipment)
  
  // Add Equipment Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    company: "",
    usedBy: "Employee",
    maintenanceTeam: "",
    assignedDate: new Date().toISOString().split("T")[0],
    technician: "",
    employee: "",
    scrapDate: "",
    location: "",
    workCenter: "",
    description: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyExpiry: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [filterTechnician, setFilterTechnician] = useState<string>("")
  const [filterCompany, setFilterCompany] = useState<string>("")

  // <CHANGE> Function to get open maintenance requests count for equipment
  const getOpenRequestsCount = (equipmentId: string) => {
    return maintenanceRequests.filter(
      (req) => req.equipmentId === equipmentId && req.stage !== "repaired" && req.stage !== "scrap"
    ).length
  }

  // <CHANGE> Function to get all requests for selected equipment
  const getEquipmentRequests = (equipmentId: string) => {
    return maintenanceRequests.filter((req) => req.equipmentId === equipmentId)
  }

  const handleViewMaintenance = (equipmentId: string) => {
    setSelectedEquipment(equipmentId)
    setIsMaintenanceDialogOpen(true)
  }

  const handleViewDetails = (equipmentId: string) => {
    setSelectedEquipment(equipmentId)
    setIsDetailDialogOpen(true)
  }

  const handleAddEquipment = () => {
    if (!formData.name || !formData.category || !formData.company) {
      alert("Please fill in all required fields (Name, Category, and Company)")
      return
    }

    const newEquipment = {
      id: `EQ-${String(equipmentList.length + 1).padStart(3, "0")}`,
      name: formData.name,
      serialNumber: formData.serialNumber || `SN-${Date.now()}`,
      category: formData.category,
      status: "Operational" as const,
      technician: formData.technician || formData.employee || "Unassigned",
      company: formData.company,
      purchaseDate: formData.purchaseDate || formData.assignedDate,
      warrantyExpiry: formData.warrantyExpiry || "",
      location: formData.location || "Not specified",
    }

    setEquipmentList([...equipmentList, newEquipment])
    setIsAddDialogOpen(false)
    
    // Reset form
    setFormData({
      name: "",
      category: "",
      company: "",
      usedBy: "Employee",
      maintenanceTeam: "",
      assignedDate: new Date().toISOString().split("T")[0],
      technician: "",
      employee: "",
      scrapDate: "",
      location: "",
      workCenter: "",
      description: "",
      serialNumber: "",
      purchaseDate: "",
      warrantyExpiry: "",
    })
  }

  const selectedEquipmentData = equipmentList.find((eq) => eq.id === selectedEquipment)
  const selectedRequests = selectedEquipment ? getEquipmentRequests(selectedEquipment) : []

  // Derived filter lists
  const categoryOptions = Array.from(new Set(equipmentList.map((e) => e.category)))
  const statusOptions = Array.from(new Set(equipmentList.map((e) => e.status)))
  const technicianOptions = Array.from(new Set(equipmentList.map((e) => e.technician)))
  const companyOptions = Array.from(new Set(equipmentList.map((e) => e.company)))

  const clearFilters = () => {
    setFilterCategory("")
    setFilterStatus("")
    setFilterTechnician("")
    setFilterCompany("")
  }

  const filteredEquipment = equipmentList.filter((item) => {
    const matchesSearch = searchQuery
      ? [item.name, item.id, item.category, item.technician, item.company]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true

    const matchesCategory = filterCategory ? item.category === filterCategory : true
    const matchesStatus = filterStatus ? item.status === filterStatus : true
    const matchesTechnician = filterTechnician ? item.technician === filterTechnician : true
    const matchesCompany = filterCompany ? item.company === filterCompany : true

    return matchesSearch && matchesCategory && matchesStatus && matchesTechnician && matchesCompany
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Equipment Assets</h1>
          <p className="text-sm text-muted-foreground">Manage and track your industrial assets.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      <Card className="border-border/50 bg-card/30">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-9 bg-muted/30 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="pl-6">Equipment Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Primary Technician</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="w-[140px] text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => {
                const openCount = getOpenRequestsCount(item.id)
                return (
                  <TableRow key={item.id} className="border-border/50 group transition-colors hover:bg-accent/20">
                    <TableCell className="font-medium pl-6">
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{item.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal border-border/50 bg-background/50">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          item.status === "Operational"
                            ? "bg-chart-2/15 text-chart-2 border-chart-2/20"
                            : item.status === "Under Repair"
                              ? "bg-primary/15 text-primary border-primary/20"
                              : item.status === "Scrapped"
                                ? "bg-destructive/15 text-destructive border-destructive/20"
                                : "bg-muted/50 text-muted-foreground"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{item.technician}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.company}</TableCell>
                    <TableCell className="text-right pr-6">
                      {/* <CHANGE> Smart button showing maintenance requests count */}
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleViewDetails(item.id)}
                        >
                          <span className="text-xs">Details</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 relative"
                          onClick={() => handleViewMaintenance(item.id)}
                        >
                          <Wrench className="h-3.5 w-3.5" />
                          <span>Maintenance</span>
                          {openCount > 0 && (
                            <Badge className="ml-1 h-5 min-w-5 bg-primary text-primary-foreground border-none px-1.5">
                              {openCount}
                            </Badge>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Filters Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filter Equipment</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 px-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Technician</Label>
              <Select value={filterTechnician} onValueChange={setFilterTechnician}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All technicians" />
                </SelectTrigger>
                <SelectContent>
                  {technicianOptions.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Select value={filterCompany} onValueChange={setFilterCompany}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All companies" />
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <div className="flex items-center justify-between gap-2">
              <Button variant="ghost" onClick={clearFilters} className="bg-transparent">Clear</Button>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-transparent" onClick={() => setIsFilterOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsFilterOpen(false)}>Apply</Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* <CHANGE> Dialog to show maintenance history for selected equipment */}
      <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Maintenance History
            </DialogTitle>
            <DialogDescription>
              {selectedEquipmentData
                ? `All maintenance requests for ${selectedEquipmentData.name} (${selectedEquipmentData.id})`
                : "Equipment maintenance history"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {selectedRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No maintenance requests found for this equipment.</p>
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

      {/* Equipment Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Equipment Details</DialogTitle>
            <DialogDescription>
              {selectedEquipmentData ? `Details for ${selectedEquipmentData.name}` : "Equipment details"}
            </DialogDescription>
          </DialogHeader>
          {selectedEquipmentData && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Equipment Name</p>
                    <p className="text-sm font-medium mt-1">{selectedEquipmentData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Serial Number</p>
                    <p className="text-sm font-mono font-medium mt-1">{selectedEquipmentData.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Equipment ID</p>
                    <p className="text-sm font-mono font-medium mt-1">{selectedEquipmentData.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Category</p>
                    <p className="text-sm font-medium mt-1">{selectedEquipmentData.category}</p>
                  </div>
                </div>
              </div>

              {/* Purchase & Warranty */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Purchase & Warranty</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Purchase Date</p>
                    <p className="text-sm font-medium mt-1">
                      {new Date(selectedEquipmentData.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Warranty Expiry</p>
                    <p className={`text-sm font-medium mt-1 ${new Date(selectedEquipmentData.warrantyExpiry) < new Date() ? "text-destructive" : "text-chart-2"}`}>
                      {new Date(selectedEquipmentData.warrantyExpiry).toLocaleDateString()}
                      {new Date(selectedEquipmentData.warrantyExpiry) < new Date() && <span className="ml-2 text-xs">(Expired)</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Location</h3>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-sm font-medium">{selectedEquipmentData.location}</p>
                </div>
              </div>

              {/* Assigned To */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Assigned Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Primary Technician</p>
                    <p className="text-sm font-medium mt-1">{selectedEquipmentData.technician}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Company</p>
                    <p className="text-sm font-medium mt-1">{selectedEquipmentData.company}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
                    <Badge className="mt-1">{selectedEquipmentData.status}</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Equipment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Equipment</DialogTitle>
            <DialogDescription>Fill in the equipment details to add it to your asset inventory</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Samsung Monitor 15"
                />
              </div>

              {/* Technician */}
              <div className="grid gap-2">
                <Label htmlFor="technician">Technician</Label>
                <Select value={formData.technician} onValueChange={(value) => setFormData({ ...formData, technician: value })}>
                  <SelectTrigger id="technician">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {INITIAL_TEAMS.flatMap(team => 
                      team.members.filter(m => m.status === "Active").map(member => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Equipment Category */}
              <div className="grid gap-2">
                <Label htmlFor="category">Equipment Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monitors">Monitors</SelectItem>
                    <SelectItem value="Laptops">Laptops</SelectItem>
                    <SelectItem value="Servers">Servers</SelectItem>
                    <SelectItem value="Printers">Printers</SelectItem>
                    <SelectItem value="Production Equipment">Production Equipment</SelectItem>
                    <SelectItem value="Material Handling">Material Handling</SelectItem>
                    <SelectItem value="HVAC Systems">HVAC Systems</SelectItem>
                    <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Employee */}
              <div className="grid gap-2">
                <Label htmlFor="employee">Employee</Label>
                <Select value={formData.employee} onValueChange={(value) => setFormData({ ...formData, employee: value })}>
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {INITIAL_TEAMS.flatMap(team => 
                      team.members.map(member => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Company */}
              <div className="grid gap-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., My Company (San Francisco)"
                />
              </div>

              {/* Scrap Date */}
              <div className="grid gap-2">
                <Label htmlFor="scrapDate">Scrap Date</Label>
                <Input
                  id="scrapDate"
                  type="date"
                  value={formData.scrapDate}
                  onChange={(e) => setFormData({ ...formData, scrapDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Used By</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="usedByEmployee"
                    checked={formData.usedBy === "Employee"}
                    onChange={() => setFormData({ ...formData, usedBy: "Employee" })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="usedByEmployee" className="font-normal cursor-pointer">Employee</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Used in location */}
              <div className="grid gap-2">
                <Label htmlFor="location">Used in location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Building A, Floor 2"
                />
              </div>

              {/* Maintenance Team */}
              <div className="grid gap-2">
                <Label htmlFor="maintenanceTeam">Maintenance Team</Label>
                <Select value={formData.maintenanceTeam} onValueChange={(value) => setFormData({ ...formData, maintenanceTeam: value })}>
                  <SelectTrigger id="maintenanceTeam">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {INITIAL_TEAMS.map(team => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Work Center */}
              <div className="grid gap-2">
                <Label htmlFor="workCenter">Work Center</Label>
                <Input
                  id="workCenter"
                  value={formData.workCenter}
                  onChange={(e) => setFormData({ ...formData, workCenter: e.target.value })}
                  placeholder="Work center code"
                />
              </div>

              {/* Assigned Date */}
              <div className="grid gap-2">
                <Label htmlFor="assignedDate">Assigned Date</Label>
                <Input
                  id="assignedDate"
                  type="date"
                  value={formData.assignedDate}
                  onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                />
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="e.g., SN-2024-001"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional notes or description"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEquipment}>
              Add Equipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
