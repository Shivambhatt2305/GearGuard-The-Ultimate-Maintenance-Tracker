"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, CalendarIcon, TrendingUp, AlertCircle } from "lucide-react"

const maintenanceRequests = [
  { id: "1", team: "Facility Management", category: "HVAC Systems", stage: "new", priority: "High" },
  { id: "2", team: "Internal Maintenance", category: "Production Equipment", stage: "in-progress", priority: "Medium" },
  { id: "3", team: "Internal Maintenance", category: "Material Handling", stage: "new", priority: "Low" },
  { id: "4", team: "Electronics Specialist", category: "Laptops", stage: "scrap", priority: "High" },
  { id: "5", team: "Internal Maintenance", category: "Production Equipment", stage: "repaired", priority: "Medium" },
  { id: "6", team: "Electronics Specialist", category: "Monitors", stage: "new", priority: "Medium" },
  { id: "7", team: "Internal Maintenance", category: "Servers", stage: "in-progress", priority: "High" },
  { id: "8", team: "Facility Management", category: "HVAC Systems", stage: "new", priority: "Low" },
  { id: "9", team: "Electronics Specialist", category: "Printers", stage: "repaired", priority: "Low" },
  { id: "10", team: "Internal Maintenance", category: "Production Equipment", stage: "new", priority: "High" },
  { id: "11", team: "Rapid Response", category: "Material Handling", stage: "in-progress", priority: "High" },
  { id: "12", team: "Facility Management", category: "HVAC Systems", stage: "repaired", priority: "Medium" },
]

const getRequestsByTeam = () => {
  const teamCounts: { [key: string]: number } = {}
  maintenanceRequests.forEach((req) => {
    teamCounts[req.team] = (teamCounts[req.team] || 0) + 1
  })
  return Object.entries(teamCounts).map(([name, count]) => ({ name, count }))
}

const getRequestsByCategory = () => {
  const categoryCounts: { [key: string]: number } = {}
  maintenanceRequests.forEach((req) => {
    categoryCounts[req.category] = (categoryCounts[req.category] || 0) + 1
  })
  return Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))
}

const getRequestsByStage = () => {
  const stageCounts: { [key: string]: number } = {}
  maintenanceRequests.forEach((req) => {
    stageCounts[req.stage] = (stageCounts[req.stage] || 0) + 1
  })
  return [
    { name: "New", value: stageCounts["new"] || 0, color: "oklch(0.6 0.2 250)" },
    { name: "In Progress", value: stageCounts["in-progress"] || 0, color: "oklch(0.7 0.15 160)" },
    { name: "Repaired", value: stageCounts["repaired"] || 0, color: "oklch(0.7 0.15 160)" },
    { name: "Scrapped", value: stageCounts["scrap"] || 0, color: "oklch(0.6 0.2 20)" },
  ]
}



const getRequestsByPriority = () => {
  const priorityCounts: { [key: string]: number } = { High: 0, Medium: 0, Low: 0 }
  maintenanceRequests.forEach((req) => {
    priorityCounts[req.priority] = (priorityCounts[req.priority] || 0) + 1
  })
  return Object.entries(priorityCounts).map(([name, count]) => ({ name, count }))
}

const requestsByTeam = getRequestsByTeam()
const requestsByCategory = getRequestsByCategory()
const requestsByStage = getRequestsByStage()
const requestsByPriority = getRequestsByPriority()

const totalRequests = maintenanceRequests.length
const openRequests = maintenanceRequests.filter((r) => r.stage !== "repaired" && r.stage !== "scrap").length
const criticalRequests = maintenanceRequests.filter((r) => r.priority === "High").length

export default function ReportsPage() {
  const handleExportData = () => {
    const reportData = {
      summary: {
        totalRequests,
        openRequests,
        criticalRequests,
        generatedAt: new Date().toISOString(),
      },
      requestsByTeam,
      requestsByCategory,
      requestsByStage,
      requestsByPriority,
      allRequests: maintenanceRequests,
    }

    const data = JSON.stringify(reportData, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `maintenance-analytics-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground">Performance auditing and maintenance cost analysis.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <CalendarIcon className="h-4 w-4" />
            Last 6 Months
          </Button>
          <Button size="sm" className="gap-2" onClick={handleExportData}>
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground">All maintenance requests</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{openRequests}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalRequests}</div>
            <p className="text-xs text-muted-foreground">High priority requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/30">
          <CardHeader>
            <CardTitle>Requests by Team</CardTitle>
            <CardDescription>Total maintenance requests assigned to each team.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsByTeam}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                <XAxis
                  dataKey="name"
                  stroke="#666"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/30">
          <CardHeader>
            <CardTitle>Requests by Equipment Category</CardTitle>
            <CardDescription>Breakdown of maintenance requests by equipment type.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsByCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                <XAxis
                  dataKey="name"
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Bar dataKey="count" fill="oklch(0.7 0.15 160)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/30">
          <CardHeader>
            <CardTitle>Request Stage Distribution</CardTitle>
            <CardDescription>Current status of all maintenance requests.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={requestsByStage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {requestsByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/30">
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Breakdown of requests by priority level.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsByPriority}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/30">
        <CardHeader>
          <CardTitle>Detailed Team Performance</CardTitle>
          <CardDescription>Comprehensive breakdown of requests by team with insights.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requestsByTeam.map((team) => {
              const teamRequests = maintenanceRequests.filter((r) => r.team === team.name)
              const openCount = teamRequests.filter((r) => r.stage !== "repaired" && r.stage !== "scrap").length
              return (
                <div
                  key={team.name}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{team.name}</p>
                    <p className="text-xs text-muted-foreground">Total Requests: {team.count}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                      {openCount} Open
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {team.count - openCount} Closed
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

