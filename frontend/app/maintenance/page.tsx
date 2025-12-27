"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Clock, CheckCircle2, Trash2, GripVertical, Search, Download, User, Building2, Wrench } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Suspense } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  type WorkOrder,
  type Team,
  type TeamMember,
  EQUIPMENT_DATABASE,
  INITIAL_TEAMS,
  getTeamForEquipment,
  getActiveMembers,
} from "@/lib/data"

const STAGES = [
  { id: "new", name: "New Request", icon: Plus, color: "text-primary" },
  { id: "in-progress", name: "In Progress", icon: Clock, color: "text-chart-2" },
  { id: "repaired", name: "Repaired", icon: CheckCircle2, color: "text-chart-2" },
  { id: "scrap", name: "Scrapped", icon: Trash2, color: "text-destructive" },
] as const

const initialWorkOrders: WorkOrder[] = [
  {
    id: "WO-001",
    title: "AC Unit Leakage",
    description: "HVAC unit leaking water on the roof",
    equipmentId: "EQ-107",
    equipmentName: "HVAC Unit PM-04",
    category: "HVAC Systems",
    teamId: "team-1",
    teamName: "Facility Management",
    assignedTo: "max.foster",
    priority: "High",
    type: "Corrective",
    status: "new",
    createdBy: "system",
    createdAt: "2025-12-20",
  },
  {
    id: "WO-002",
    title: "Conveyor Belt Calibration",
    description: "Routine calibration check",
    equipmentId: "EQ-105",
    equipmentName: "Assembly Line 02",
    category: "Production Equipment",
    teamId: "team-2",
    teamName: "Internal Maintenance",
    assignedTo: "john.smith",
    priority: "Medium",
    type: "Preventive",
    status: "in-progress",
    scheduledDate: "2025-12-25",
    startDate: "2025-12-24",
    estimatedHours: 3,
    createdBy: "mitchell.admin",
    createdAt: "2025-12-18",
  },
  {
    id: "WO-003",
    title: "Hydraulic Fluid Replacement",
    description: "Replace hydraulic fluid in forklift",
    equipmentId: "EQ-106",
    equipmentName: "Forklift H2",
    category: "Material Handling",
    teamId: "team-2",
    teamName: "Internal Maintenance",
    priority: "Low",
    type: "Preventive",
    status: "new",
    scheduledDate: "2025-12-28",
    estimatedHours: 2,
    createdBy: "john.smith",
    createdAt: "2025-12-19",
  },
  {
    id: "WO-004",
    title: "Laptop Screen Malfunction",
    description: "Screen flickering issue - irreparable",
    equipmentId: "EQ-102",
    equipmentName: "Acer Laptop X5",
    category: "Laptops",
    teamId: "team-3",
    teamName: "Electronics Specialist",
    assignedTo: "abigail.p",
    priority: "High",
    type: "Corrective",
    status: "scrap",
    startDate: "2025-12-15",
    completedDate: "2025-12-16",
    actualHours: 2,
    createdBy: "abigail.p",
    createdAt: "2025-12-15",
  },
  {
    id: "WO-005",
    title: "Annual Safety Check",
    description: "Yearly safety inspection completed",
    equipmentId: "EQ-108",
    equipmentName: "CNC Machine X1",
    category: "Production Equipment",
    teamId: "team-2",
    teamName: "Internal Maintenance",
    assignedTo: "mitchell.admin",
    priority: "Medium",
    type: "Preventive",
    status: "repaired",
    scheduledDate: "2025-12-22",
    startDate: "2025-12-22",
    completedDate: "2025-12-23",
    estimatedHours: 4,
    actualHours: 3.5,
    createdBy: "mitchell.admin",
    createdAt: "2025-12-21",
  },
]

function MaintenanceKanbanContent() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [scrapConfirmation, setScrapConfirmation] = useState<{ show: boolean; orderId: string; orderTitle: string }>({
    show: false,
    orderId: "",
    orderTitle: "",
  })
  const [formData, setFormData] = useState({
    requestType: "Equipment" as "Equipment" | "Work Center",
    subject: "",
    title: "",
    description: "",
    equipmentId: "",
    workCenterId: "",
    teamId: "",
    assignedTo: "",
    type: "Corrective" as "Corrective" | "Preventive",
    priority: "Medium" as "High" | "Medium" | "Low",
    requestDate: new Date().toISOString().split("T")[0],
    scheduledDate: "",
    scheduledTime: "",
    duration: "",
    company: "",
    notes: "",
    instructions: "",
    estimatedHours: "",
  })

  const selectedEquipment = formData.equipmentId
    ? EQUIPMENT_DATABASE.find((eq) => eq.id === formData.equipmentId)
    : null

  const selectedTeam = formData.teamId ? INITIAL_TEAMS.find((t) => t.id === formData.teamId) : null
  const availableMembers = selectedTeam ? getActiveMembers(selectedTeam.id) : []

  const filteredOrders = useMemo(() => {
    return workOrders.filter(
      (order) =>
        order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.teamName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [workOrders, searchQuery])

  const handleCreateRequest = () => {
    if (!formData.subject || (formData.requestType === "Equipment" && !formData.equipmentId) || !formData.teamId || !selectedTeam) {
      alert("Please fill in all required fields (Subject, " + (formData.requestType === "Equipment" ? "Equipment" : "Work Center") + ", and Team)")
      return
    }

    if (formData.type === "Preventive" && !formData.scheduledDate) {
      alert("Scheduled date is required for Preventive Maintenance")
      return
    }

    const scheduledDateTime = formData.scheduledDate && formData.scheduledTime 
      ? `${formData.scheduledDate} ${formData.scheduledTime}` 
      : formData.scheduledDate

    const newWorkOrder: WorkOrder = {
      id: `WO-${String(workOrders.length + 1).padStart(3, '0')}`,
      title: formData.subject,
      description: formData.notes || formData.description,
      equipmentId: formData.requestType === "Equipment" ? formData.equipmentId : "",
      equipmentName: selectedEquipment?.name || "N/A",
      category: selectedEquipment?.category || "Work Center",
      teamId: formData.teamId,
      teamName: selectedTeam.name,
      assignedTo: formData.assignedTo || undefined,
      priority: formData.priority,
      type: formData.type,
      status: "new",
      scheduledDate: scheduledDateTime,
      estimatedHours: formData.duration ? parseFloat(formData.duration) : formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
      createdBy: "mitchell.admin",
      createdAt: formData.requestDate,
      notes: formData.notes,
    }

    setWorkOrders([...workOrders, newWorkOrder])
    setIsDialogOpen(false)
    setFormData({
      requestType: "Equipment",
      subject: "",
      title: "",
      description: "",
      equipmentId: "",
      workCenterId: "",
      teamId: "",
      assignedTo: "",
      type: "Corrective",
      priority: "Medium",
      requestDate: new Date().toISOString().split("T")[0],
      scheduledDate: "",
      scheduledTime: "",
      duration: "",
      company: "",
      notes: "",
      instructions: "",
      estimatedHours: "",
    })
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId) return

    const newStatus = destination.droppableId as WorkOrder["status"]
    const order = workOrders.find((o) => o.id === draggableId)

    if (newStatus === "scrap" && order) {
      setScrapConfirmation({
        show: true,
        orderId: draggableId,
        orderTitle: order.title,
      })
    } else {
      const updateData: Partial<WorkOrder> = { status: newStatus }
      
      if (newStatus === "in-progress" && !order?.startDate) {
        updateData.startDate = new Date().toISOString().split("T")[0]
      } else if (newStatus === "repaired" && !order?.completedDate) {
        updateData.completedDate = new Date().toISOString().split("T")[0]
      }

      setWorkOrders((prev) => prev.map((wo) => (wo.id === draggableId ? { ...wo, ...updateData } : wo)))
    }
  }

  const handleConfirmScrap = () => {
    const order = workOrders.find((o) => o.id === scrapConfirmation.orderId)
    if (order) {
      setWorkOrders((prev) =>
        prev.map((o) =>
          o.id === scrapConfirmation.orderId
            ? { ...o, status: "scrap" as const, completedDate: new Date().toISOString().split("T")[0] }
            : o
        )
      )
      alert(
        `⚠️ SCRAP NOTICE\n\nEquipment: ${order.equipmentName} (${order.equipmentId})\nStatus: Marked as SCRAPPED\n\nThis equipment is no longer usable and will be marked in the system.`,
      )
    }
    setScrapConfirmation({ show: false, orderId: "", orderTitle: "" })
  }

  const downloadReport = () => {
    const data = JSON.stringify(tasks, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `maintenance-report-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Workflow</h1>
          <p className="text-sm text-muted-foreground">Drag and drop tasks to manage active maintenance requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={downloadReport}>
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Maintenance Request</DialogTitle>
                <DialogDescription>Fill in the details for the new work order</DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                {/* Request Type Selection */}
                <div className="grid gap-3">
                  <Label className="text-sm font-semibold">Request Created For *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={formData.requestType === "Equipment" ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col items-center gap-2"
                      onClick={() => setFormData({ ...formData, requestType: "Equipment", workCenterId: "" })}
                    >
                      <Wrench className="h-5 w-5" />
                      <span>Equipment</span>
                    </Button>
                    <Button
                      type="button"
                      variant={formData.requestType === "Work Center" ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col items-center gap-2"
                      onClick={() => setFormData({ ...formData, requestType: "Work Center", equipmentId: "" })}
                    >
                      <Building2 className="h-5 w-5" />
                      <span>Work Center</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Subject */}
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Test activity"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  {/* Created By */}
                  <div className="grid gap-2">
                    <Label>Created By</Label>
                    <Input
                      value="Mitchell Admin"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                {/* Equipment or Work Center Selection */}
                {formData.requestType === "Equipment" ? (
                  <div className="grid gap-2">
                    <Label htmlFor="equipment">Maintenance For (Equipment) *</Label>
                    <Select
                      value={formData.equipmentId}
                      onValueChange={(value) => {
                        const equipment = EQUIPMENT_DATABASE.find(eq => eq.id === value)
                        setFormData({ 
                          ...formData, 
                          equipmentId: value,
                          company: equipment?.company || formData.company
                        })
                      }}
                    >
                      <SelectTrigger id="equipment">
                        <SelectValue placeholder="Select equipment..." />
                      </SelectTrigger>
                      <SelectContent>
                        {EQUIPMENT_DATABASE.map((eq) => (
                          <SelectItem key={eq.id} value={eq.id}>
                            {eq.name}/{eq.serialNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="workCenter">Work Center *</Label>
                    <Input
                      id="workCenter"
                      placeholder="Enter work center"
                      value={formData.workCenterId}
                      onChange={(e) => setFormData({ ...formData, workCenterId: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      When Work Center is selected, you must specify which work center this request is for
                    </p>
                  </div>
                )}

                {/* Equipment Details */}
                {selectedEquipment && formData.requestType === "Equipment" && (
                  <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-3">
                    <p className="text-sm font-semibold text-foreground">Equipment Information</p>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Equipment</p>
                        <p className="font-medium">{selectedEquipment.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Category</p>
                        <p className="font-medium">{selectedEquipment.category}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Serial Number</p>
                        <p className="font-medium font-mono text-xs">{selectedEquipment.serialNumber}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Request Date */}
                  <div className="grid gap-2">
                    <Label htmlFor="requestDate">Request Date</Label>
                    <Input
                      id="requestDate"
                      type="date"
                      value={formData.requestDate}
                      onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                    />
                  </div>

                  {/* Maintenance Type */}
                  <div className="grid gap-2">
                    <Label>Maintenance Type *</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value: "Corrective" | "Preventive") => setFormData({ ...formData, type: value })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Corrective" id="corrective" />
                        <Label htmlFor="corrective" className="font-normal cursor-pointer">Corrective</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Preventive" id="preventive" />
                        <Label htmlFor="preventive" className="font-normal cursor-pointer">Preventive</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Team */}
                  <div className="grid gap-2">
                    <Label htmlFor="team">Team *</Label>
                    <Select
                      value={formData.teamId}
                      onValueChange={(value) => {
                        setFormData({ ...formData, teamId: value, assignedTo: "" })
                      }}
                    >
                      <SelectTrigger id="team">
                        <SelectValue placeholder="Select team..." />
                      </SelectTrigger>
                      <SelectContent>
                        {INITIAL_TEAMS.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Technician */}
                  {selectedTeam && availableMembers.length > 0 && (
                    <div className="grid gap-2">
                      <Label htmlFor="assignedTo">Technician (Internal Maintenance)</Label>
                      <Select
                        value={formData.assignedTo}
                        onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                      >
                        <SelectTrigger id="assignedTo">
                          <SelectValue placeholder="Select technician..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMembers.map((member) => (
                            <SelectItem key={member.id} value={member.loginId}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Scheduled Date */}
                  <div className="grid gap-2">
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    />
                  </div>

                  {/* Scheduled Time */}
                  <div className="grid gap-2">
                    <Label htmlFor="scheduledTime">Time</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    />
                  </div>

                  {/* Duration */}
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input
                      id="duration"
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder="00:00"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Priority with Diamond Indicators */}
                  <div className="grid gap-2">
                    <Label>Priority *</Label>
                    <div className="flex items-center gap-3 p-3 rounded-md border border-border">
                      {(["Low", "Medium", "High"] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData({ ...formData, priority: level })}
                          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                          <div 
                            className={`w-4 h-4 rotate-45 border-2 transition-colors ${
                              formData.priority === level
                                ? level === "High" 
                                  ? "bg-red-500 border-red-600" 
                                  : level === "Medium"
                                  ? "bg-yellow-500 border-yellow-600"
                                  : "bg-green-500 border-green-600"
                                : "bg-transparent border-muted-foreground"
                            }`}
                          />
                          <span className={`text-sm ${formData.priority === level ? "font-semibold" : ""}`}>
                            {level}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Company */}
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="e.g., My Company (San Francisco)"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                {/* Notes and Instructions Tabs */}
                <Tabs defaultValue="notes" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  </TabsList>
                  <TabsContent value="notes" className="mt-3">
                    <Textarea
                      placeholder="Add notes about this maintenance request..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      className="resize-none"
                    />
                  </TabsContent>
                  <TabsContent value="instructions" className="mt-3">
                    <Textarea
                      placeholder="Add detailed instructions for the maintenance team..."
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      rows={4}
                      className="resize-none"
                    />
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRequest}>Create Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative shrink-0">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search workflow by title, asset or technician..."
          className="pl-9 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {STAGES.map((stage) => {
            const stageOrders = filteredOrders.filter((o) => o.status === stage.id)
            return (
              <div key={stage.id} className="min-w-[300px] w-[300px] flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <stage.icon className={`h-4 w-4 ${stage.color}`} />
                    <h3 className="font-semibold text-sm">{stage.name}</h3>
                    <Badge variant="secondary" className="bg-muted/50 text-[10px] h-5">
                      {stageOrders.length}
                    </Badge>
                  </div>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`bg-muted/30 rounded-xl p-2 flex flex-col gap-3 min-h-[500px] border border-border/40 transition-colors ${
                        snapshot.isDraggingOver ? "bg-primary/10 border-primary/40" : ""
                      }`}
                    >
                      {stageOrders.map((order, index) => {
                        const assignedMember = order.assignedTo
                          ? INITIAL_TEAMS.flatMap((t) => t.members).find((m) => m.loginId === order.assignedTo)
                          : null

                        return (
                          <Draggable key={order.id} draggableId={order.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`border-border/50 bg-card transition-all hover:shadow-md cursor-move ${
                                  snapshot.isDragging ? "shadow-lg rotate-2" : ""
                                }`}
                              >
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex items-start gap-2">
                                    <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div className="space-y-2 flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant="outline"
                                          className={
                                            order.priority === "High"
                                              ? "bg-destructive/10 text-destructive border-destructive/20 text-[10px]"
                                              : order.priority === "Medium"
                                                ? "bg-chart-2/10 text-chart-2 border-chart-2/20 text-[10px]"
                                                : "bg-muted text-muted-foreground text-[10px]"
                                          }
                                        >
                                          {order.priority}
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px]">
                                          {order.type}
                                        </Badge>
                                      </div>
                                      <h4 className="font-semibold text-sm leading-tight">{order.title}</h4>
                                      {order.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">{order.description}</p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="text-muted-foreground">Equipment:</span>
                                      <span className="font-medium truncate">{order.equipmentName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-muted-foreground">ID:</span>
                                      <span className="font-mono text-[11px]">{order.id}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-muted-foreground">Team:</span>
                                      <Badge variant="outline" className="text-[10px] font-normal">
                                        {order.teamName}
                                      </Badge>
                                    </div>
                                    {assignedMember && (
                                      <div className="flex items-center gap-2">
                                        <User className="h-3 w-3 text-muted-foreground" />
                                        <span className="font-medium">{assignedMember.name}</span>
                                        <Badge variant="outline" className="text-[9px]">
                                          {assignedMember.role}
                                        </Badge>
                                      </div>
                                    )}
                                    {order.scheduledDate && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">Scheduled:</span>
                                        <span className="font-medium">{order.scheduledDate}</span>
                                      </div>
                                    )}
                                    {order.estimatedHours && (
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        <span>{order.estimatedHours}h estimated</span>
                                      </div>
                                    )}
                                    {order.actualHours && (
                                      <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3 w-3 text-chart-2" />
                                        <span className="text-chart-2">{order.actualHours}h actual</span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                      {stageOrders.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <stage.icon className={`h-8 w-8 ${stage.color} opacity-20 mb-2`} />
                          <p className="text-xs text-muted-foreground">No orders in this stage</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      <Dialog
        open={scrapConfirmation.show}
        onOpenChange={(open) => !open && setScrapConfirmation({ show: false, orderId: "", orderTitle: "" })}
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Confirm Equipment Scrap
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this equipment as scrapped? This action will flag the equipment as no longer
              usable.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Work Order:</p>
            <p className="text-sm text-muted-foreground">{scrapConfirmation.orderTitle}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScrapConfirmation({ show: false, orderId: "", orderTitle: "" })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmScrap} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Mark as Scrapped
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function MaintenanceKanban() {
  return (
    <Suspense fallback={null}>
      <MaintenanceKanbanContent />
    </Suspense>
  )
}
