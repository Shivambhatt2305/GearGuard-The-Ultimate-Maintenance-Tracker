"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Clock, CheckCircle2, Trash2, GripVertical, Search, Download } from "lucide-react"
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

const EQUIPMENT_DATABASE = [
  {
    id: "EQ-101",
    name: 'Samsung Monitor 15"',
    category: "Monitors",
    team: "Electronics Specialist",
    technician: "Mitchell Admin",
    serialNumber: "SM-2024-101",
    location: "Office Building A",
  },
  {
    id: "EQ-102",
    name: "Acer Laptop X5",
    category: "Laptops",
    team: "Electronics Specialist",
    technician: "Abigail Peterson",
    serialNumber: "AL-2024-102",
    location: "Office Building B",
  },
  {
    id: "EQ-103",
    name: "Dell Server R740",
    category: "Servers",
    team: "Internal Maintenance",
    technician: "Mitchell Admin",
    serialNumber: "DS-2024-103",
    location: "Data Center",
  },
  {
    id: "EQ-104",
    name: "HP Laserjet Pro",
    category: "Printers",
    team: "Electronics Specialist",
    technician: "Abigail Peterson",
    serialNumber: "HP-2021-004",
    location: "Office Building A",
  },
  {
    id: "EQ-105",
    name: "Assembly Line 02",
    category: "Production Equipment",
    team: "Internal Maintenance",
    technician: "Max Foster",
    serialNumber: "AL-2023-002",
    location: "Production Floor",
  },
  {
    id: "EQ-106",
    name: "Forklift H2",
    category: "Material Handling",
    team: "Internal Maintenance",
    technician: "Mitchell Admin",
    serialNumber: "FH-2022-002",
    location: "Warehouse",
  },
  {
    id: "EQ-107",
    name: "HVAC Unit PM-04",
    category: "HVAC Systems",
    team: "Facility Management",
    technician: "Max Foster",
    serialNumber: "HVAC-2021-004",
    location: "Building Rooftop",
  },
  {
    id: "EQ-108",
    name: "CNC Machine X1",
    category: "Production Equipment",
    team: "Internal Maintenance",
    technician: "Mitchell Admin",
    serialNumber: "CNC-2023-001",
    location: "Production Floor",
  },
]

interface MaintenanceTask {
  id: string
  title: string
  description?: string
  equipmentId: string
  asset: string
  category: string
  team: string
  priority: "High" | "Medium" | "Low"
  type: "Corrective" | "Preventive"
  stage: "new" | "in-progress" | "repaired" | "scrap"
  technician: string
  scheduledDate?: string
  duration?: number
  createdAt: string
}

const STAGES = [
  { id: "new", name: "New Request", icon: Plus, color: "text-primary" },
  { id: "in-progress", name: "In Progress", icon: Clock, color: "text-chart-2" },
  { id: "repaired", name: "Repaired", icon: CheckCircle2, color: "text-chart-2" },
  { id: "scrap", name: "Scrapped", icon: Trash2, color: "text-destructive" },
] as const

const initialTasks: MaintenanceTask[] = [
  {
    id: "1",
    title: "AC Unit Leakage",
    description: "HVAC unit leaking water on the roof",
    equipmentId: "EQ-107",
    asset: "HVAC Unit PM-04",
    category: "HVAC Systems",
    team: "Facility Management",
    priority: "High",
    type: "Corrective",
    stage: "new",
    technician: "Max Foster",
    createdAt: "2025-12-20",
  },
  {
    id: "2",
    title: "Conveyor Belt Calibration",
    description: "Routine calibration check",
    equipmentId: "EQ-105",
    asset: "Assembly Line 02",
    category: "Production Equipment",
    team: "Internal Maintenance",
    priority: "Medium",
    type: "Preventive",
    stage: "in-progress",
    technician: "Max Foster",
    scheduledDate: "2025-12-25",
    createdAt: "2025-12-18",
  },
  {
    id: "3",
    title: "Hydraulic Fluid Replacement",
    description: "Replace hydraulic fluid",
    equipmentId: "EQ-106",
    asset: "Forklift H2",
    category: "Material Handling",
    team: "Internal Maintenance",
    priority: "Low",
    type: "Preventive",
    stage: "new",
    technician: "Mitchell Admin",
    scheduledDate: "2025-12-28",
    createdAt: "2025-12-19",
  },
  {
    id: "4",
    title: "Laptop Screen Malfunction",
    description: "Screen flickering issue",
    equipmentId: "EQ-102",
    asset: "Acer Laptop X5",
    category: "Laptops",
    team: "Electronics Specialist",
    priority: "High",
    type: "Corrective",
    stage: "scrap",
    technician: "Abigail Peterson",
    createdAt: "2025-12-15",
  },
  {
    id: "5",
    title: "Annual Safety Check",
    description: "Yearly safety inspection",
    equipmentId: "EQ-108",
    asset: "CNC Machine X1",
    category: "Production Equipment",
    team: "Internal Maintenance",
    priority: "Medium",
    type: "Preventive",
    stage: "repaired",
    technician: "Mitchell Admin",
    scheduledDate: "2025-12-22",
    duration: 4,
    createdAt: "2025-12-21",
  },
]

function MaintenanceKanbanContent() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [scrapConfirmation, setScrapConfirmation] = useState<{ show: boolean; taskId: string; taskTitle: string }>({
    show: false,
    taskId: "",
    taskTitle: "",
  })
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    equipmentId: "",
    type: "Corrective" as "Corrective" | "Preventive",
    priority: "Medium" as "High" | "Medium" | "Low",
    scheduledDate: "",
  })

  const selectedEquipment = formData.equipmentId
    ? EQUIPMENT_DATABASE.find((eq) => eq.id === formData.equipmentId)
    : null

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.technician.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [tasks, searchQuery])

  const handleCreateRequest = () => {
    if (!formData.title || !formData.equipmentId || !selectedEquipment) {
      alert("Please fill in all required fields (Title and Equipment)")
      return
    }

    if (formData.type === "Preventive" && !formData.scheduledDate) {
      alert("Scheduled date is required for Preventive Maintenance")
      return
    }

    const newTask: MaintenanceTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      equipmentId: formData.equipmentId,
      asset: selectedEquipment.name,
      category: selectedEquipment.category,
      team: selectedEquipment.team,
      priority: formData.priority,
      type: formData.type,
      stage: "new",
      technician: selectedEquipment.technician,
      scheduledDate: formData.type === "Preventive" ? formData.scheduledDate : undefined,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setTasks([...tasks, newTask])
    setIsDialogOpen(false)
    setFormData({
      title: "",
      description: "",
      equipmentId: "",
      type: "Corrective",
      priority: "Medium",
      scheduledDate: "",
    })
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId) return

    const newStage = destination.droppableId as MaintenanceTask["stage"]
    const task = tasks.find((t) => t.id === draggableId)

    if (newStage === "scrap" && task) {
      setScrapConfirmation({
        show: true,
        taskId: draggableId,
        taskTitle: task.title,
      })
    } else {
      setTasks((prev) => prev.map((task) => (task.id === draggableId ? { ...task, stage: newStage } : task)))
    }
  }

  const handleConfirmScrap = () => {
    const task = tasks.find((t) => t.id === scrapConfirmation.taskId)
    if (task) {
      setTasks((prev) => prev.map((t) => (t.id === scrapConfirmation.taskId ? { ...t, stage: "scrap" as const } : t)))
      alert(
        `⚠️ SCRAP NOTICE\n\nEquipment: ${task.asset} (${task.equipmentId})\nStatus: Marked as SCRAPPED\n\nThis equipment is no longer usable and will be marked in the system.`,
      )
    }
    setScrapConfirmation({ show: false, taskId: "", taskTitle: "" })
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
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Maintenance Request</DialogTitle>
                <DialogDescription>Add a new maintenance task to the workflow.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Request Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "Corrective" | "Preventive") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Corrective">Corrective (Breakdown)</SelectItem>
                      <SelectItem value="Preventive">Preventive (Routine)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    Corrective: Unplanned repair | Preventive: Scheduled maintenance
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title">Request Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., AC Unit Leakage"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue or maintenance task..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="equipment">Select Equipment *</Label>
                  <Select
                    value={formData.equipmentId}
                    onValueChange={(value) => setFormData({ ...formData, equipmentId: value })}
                  >
                    <SelectTrigger id="equipment">
                      <SelectValue placeholder="Choose equipment..." />
                    </SelectTrigger>
                    <SelectContent>
                      {EQUIPMENT_DATABASE.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name} ({eq.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEquipment && (
                  <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-3">
                    <p className="text-sm font-semibold text-foreground">Auto-Filled Equipment Details</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Category</p>
                        <p className="font-medium">{selectedEquipment.category}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Maintenance Team</p>
                        <p className="font-medium">{selectedEquipment.team}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Assigned Technician</p>
                        <p className="font-medium">{selectedEquipment.technician}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Location</p>
                        <p className="font-medium">{selectedEquipment.location}</p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.type === "Preventive" && (
                  <div className="grid gap-2">
                    <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "High" | "Medium" | "Low") => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
          {STAGES.map((stage) => (
            <div key={stage.id} className="min-w-[300px] w-[300px] flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <stage.icon className={`h-4 w-4 ${stage.color}`} />
                  <h3 className="font-semibold text-sm">{stage.name}</h3>
                  <Badge variant="secondary" className="bg-muted/50 text-[10px] h-5">
                    {filteredTasks.filter((t) => t.stage === stage.id).length}
                  </Badge>
                </div>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`bg-muted/30 rounded-xl p-2 flex flex-col gap-3 min-h-[500px] border border-border/40 transition-colors ${
                      snapshot.isDraggingOver ? "bg-muted/50" : ""
                    } ${stage.id === "scrap" ? "border-destructive/30 bg-destructive/5" : ""}`}
                  >
                    {filteredTasks
                      .filter((t) => t.stage === stage.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`border-border/50 bg-card hover:border-primary/30 transition-all ${
                                snapshot.isDragging ? "shadow-lg rotate-1 scale-105 z-50 border-primary/50" : ""
                              } ${task.stage === "scrap" ? "border-destructive/40 bg-destructive/5" : ""}`}
                            >
                              <CardContent className="p-4 space-y-3">
                                {task.stage === "scrap" && (
                                  <div className="bg-destructive/10 border border-destructive/30 rounded-md p-2 flex items-center gap-2">
                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                    <p className="text-[10px] text-destructive font-bold uppercase tracking-wider">
                                      Equipment Scrapped
                                    </p>
                                  </div>
                                )}
                                <div className="flex items-start justify-between">
                                  <div className="flex gap-2 items-start">
                                    <GripVertical className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium leading-tight">{task.title}</p>
                                      <Badge
                                        variant="outline"
                                        className={
                                          task.type === "Preventive"
                                            ? "bg-primary/10 text-primary border-primary/20 text-[9px]"
                                            : "bg-destructive/10 text-destructive border-destructive/20 text-[9px]"
                                        }
                                      >
                                        {task.type}
                                      </Badge>
                                    </div>
                                  </div>
                                  <Badge
                                    className={
                                      task.priority === "High"
                                        ? "bg-destructive/10 text-destructive border-destructive/20"
                                        : task.priority === "Medium"
                                          ? "bg-chart-2/10 text-chart-2 border-chart-2/20"
                                          : "bg-muted/50 text-muted-foreground border-transparent"
                                    }
                                    variant="outline"
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                    Asset
                                  </p>
                                  <p className="text-xs font-medium text-foreground/80">{task.asset}</p>
                                </div>
                                {task.scheduledDate && (
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                      Scheduled
                                    </p>
                                    <p className="text-xs font-medium text-foreground/80">{task.scheduledDate}</p>
                                  </div>
                                )}
                                <div className="flex items-center justify-between pt-2">
                                  <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold uppercase">
                                      {task.technician
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{task.technician}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <Dialog
        open={scrapConfirmation.show}
        onOpenChange={(open) => !open && setScrapConfirmation({ show: false, taskId: "", taskTitle: "" })}
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
            <p className="text-sm font-semibold mb-2">Request Details:</p>
            <p className="text-sm text-muted-foreground">{scrapConfirmation.taskTitle}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScrapConfirmation({ show: false, taskId: "", taskTitle: "" })}>
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
