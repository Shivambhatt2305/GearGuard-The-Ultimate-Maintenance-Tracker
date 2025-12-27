"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Filter, CalendarIcon, Clock, Wrench } from "lucide-react"
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
import { useState } from "react"

interface PreventiveTask {
  id: string
  title: string
  description?: string
  equipmentId: string
  asset: string
  scheduledDate: string
  frequency: "Weekly" | "Monthly" | "Quarterly" | "Annually"
  technician: string
  priority: "High" | "Medium" | "Low"
}

const EQUIPMENT_DATABASE = [
  { id: "EQ-107", name: "HVAC Unit PM-04", technician: "Max Foster" },
  { id: "EQ-105", name: "Assembly Line 02", technician: "Max Foster" },
  { id: "EQ-106", name: "Forklift H2", technician: "Mitchell Admin" },
  { id: "EQ-108", name: "CNC Machine X1", technician: "Mitchell Admin" },
  { id: "EQ-101", name: 'Samsung Monitor 15"', technician: "Mitchell Admin" },
  { id: "EQ-103", name: "Dell Server R740", technician: "Mitchell Admin" },
]

export default function CalendarPage() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [preventiveTasks, setPreventiveTasks] = useState<PreventiveTask[]>([
    {
      id: "1",
      title: "HVAC PM-04 Inspection",
      description: "Quarterly HVAC maintenance",
      equipmentId: "EQ-107",
      asset: "HVAC Unit PM-04",
      scheduledDate: "2025-12-24",
      frequency: "Quarterly",
      technician: "Max Foster",
      priority: "High",
    },
    {
      id: "2",
      title: "IT Server Audit",
      description: "Monthly server health check",
      equipmentId: "EQ-103",
      asset: "Dell Server R740",
      scheduledDate: "2025-12-24",
      frequency: "Monthly",
      technician: "Mitchell Admin",
      priority: "Medium",
    },
    {
      id: "3",
      title: "Critical Drill Repair",
      description: "Emergency drill maintenance",
      equipmentId: "EQ-108",
      asset: "CNC Machine X1",
      scheduledDate: "2025-12-25",
      frequency: "Weekly",
      technician: "Mitchell Admin",
      priority: "High",
    },
    {
      id: "4",
      title: "Forklift Hydraulic Check",
      description: "Monthly hydraulic system inspection",
      equipmentId: "EQ-106",
      asset: "Forklift H2",
      scheduledDate: "2025-12-28",
      frequency: "Monthly",
      technician: "Mitchell Admin",
      priority: "Low",
    },
  ])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    equipmentId: "",
    date: "",
    time: "",
    frequency: "Monthly" as "Weekly" | "Monthly" | "Quarterly" | "Annually",
    priority: "Medium" as "High" | "Medium" | "Low",
  })

  const days = Array.from({ length: 35 }, (_, i) => i - 3)
  const today = 24

  const getTasksForDate = (day: number, month = 12, year = 2025) => {
    if (day <= 0 || day > 31) return []
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return preventiveTasks.filter((task) => task.scheduledDate === dateStr)
  }

  const handleScheduleWindow = () => {
    if (!formData.title || !formData.equipmentId || !formData.date) {
      alert("Please fill in all required fields (Title, Equipment, and Date)")
      return
    }

    const selectedEquipment = EQUIPMENT_DATABASE.find((eq) => eq.id === formData.equipmentId)
    if (!selectedEquipment) return

    const newTask: PreventiveTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      equipmentId: formData.equipmentId,
      asset: selectedEquipment.name,
      scheduledDate: formData.date,
      frequency: formData.frequency,
      technician: selectedEquipment.technician,
      priority: formData.priority,
    }

    setPreventiveTasks([...preventiveTasks, newTask])
    setIsScheduleOpen(false)
    setSelectedDate(null)
    setFormData({
      title: "",
      description: "",
      equipmentId: "",
      date: "",
      time: "",
      frequency: "Monthly",
      priority: "Medium",
    })
    alert(`✓ Scheduled!\n\n${formData.title} has been scheduled for ${formData.date}`)
  }

  const handleDateClick = (day: number) => {
    if (day > 0 && day <= 31) {
      const dateStr = `2025-12-${String(day).padStart(2, "0")}`
      setFormData({ ...formData, date: dateStr })
      setSelectedDate(day)
      setIsScheduleOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Preventive Schedule</h1>
          <p className="text-sm text-muted-foreground">Manage recurring maintenance windows.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Schedule Window
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Schedule Maintenance Window</DialogTitle>
                <DialogDescription>
                  Set up a preventive maintenance window for a specific work center or asset.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., HVAC Quarterly Inspection"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the maintenance task..."
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Start Date *</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-9"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="time"
                        type="time"
                        className="pl-9"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value: "Weekly" | "Monthly" | "Quarterly" | "Annually") =>
                        setFormData({ ...formData, frequency: value })
                      }
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: "High" | "Medium" | "Low") =>
                        setFormData({ ...formData, priority: value })
                      }
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
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsScheduleOpen(false)
                    setSelectedDate(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleScheduleWindow}>Schedule Window</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-border/50 bg-card/30">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">December 2025</h2>
            <div className="flex items-center border border-border/50 rounded-md overflow-hidden">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-r border-border/50">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 rounded-none px-4 text-xs">
                Today
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex bg-muted/30 p-1 rounded-md border border-border/50">
            <Button size="sm" variant="ghost" className="h-7 text-xs px-3 bg-background shadow-sm">
              Month
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs px-3">
              Week
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs px-3">
              Day
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b border-border/50 bg-muted/20">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-[140px]">
            {days.map((day, i) => {
              const tasks = getTasksForDate(day <= 0 ? 30 + day : day > 31 ? day - 31 : day)
              const isValidDay = day > 0 && day <= 31
              return (
                <div
                  key={i}
                  className={`border-r border-b border-border/40 p-2 transition-colors ${isValidDay ? "hover:bg-muted/20 cursor-pointer" : "bg-muted/5"}`}
                  onClick={() => isValidDay && handleDateClick(day)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-medium ${day === today ? "bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center shadow-lg shadow-primary/20" : day <= 0 || day > 31 ? "text-muted-foreground/30" : "text-muted-foreground"}`}
                    >
                      {day <= 0 ? 30 + day : day > 31 ? day - 31 : day}
                    </span>
                    {tasks.length > 0 && isValidDay && (
                      <Badge
                        variant="outline"
                        className="h-4 px-1 text-[9px] bg-primary/10 text-primary border-primary/20"
                      >
                        {tasks.length}
                      </Badge>
                    )}
                  </div>
                  {tasks.length > 0 && (
                    <div className="space-y-1">
                      {tasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className={`p-1.5 rounded-sm border-l-2 ${
                            task.priority === "High"
                              ? "bg-destructive/10 border-destructive"
                              : task.priority === "Medium"
                                ? "bg-primary/10 border-primary"
                                : "bg-chart-2/10 border-chart-2"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Wrench className="h-2.5 w-2.5 shrink-0" />
                            <p className="text-[9px] font-bold leading-tight truncate">{task.title}</p>
                          </div>
                          <p className="text-[8px] text-muted-foreground truncate mt-0.5">{task.asset}</p>
                        </div>
                      ))}
                      {tasks.length > 2 && (
                        <p className="text-[8px] text-muted-foreground text-center">+{tasks.length - 2} more</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

