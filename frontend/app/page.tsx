"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table"
import { Plus, ArrowUpRight, ArrowDownRight, Activity, Box, ClipboardList, AlertCircle, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { INITIAL_TEAMS } from "@/lib/data"

const recentMaintenanceReports = [
  {
    id: 1,
    subject: "Test activity",
    equipment: "Mitchell Admin",
    category: "Ava Foster",
    staff: "computer",
    status: "New",
  },
  {
    id: 2,
    subject: "Scheduled inspection",
    equipment: "CNC Machine X1",
    category: "Production Equipment",
    staff: "John Smith",
    status: "In Progress",
  },
  {
    id: 3,
    subject: "HVAC maintenance",
    equipment: "HVAC Unit PM-04",
    category: "HVAC Systems",
    staff: "Max Foster",
    status: "Completed",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const totalActiveMembers = INITIAL_TEAMS.flatMap(t => t.members).filter(m => m.status === "Active").length

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Overview</h1>
          <p className="text-muted-foreground">Real-time health and operational metrics for your assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
          <Button size="sm" className="gap-2" onClick={() => router.push('/maintenance')}>
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-destructive/5 backdrop-blur-sm border-destructive/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Equipment</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Units</div>
            <p className="mt-2 text-xs text-destructive font-semibold">(Health {"<"} 30%)</p>
            <Button 
              variant="link" 
              size="sm" 
              className="px-0 h-auto text-xs mt-2 text-destructive hover:text-destructive/80"
              onClick={() => router.push('/equipment')}
            >
              View Critical Assets →
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 backdrop-blur-sm border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Technician Load</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85% Utilized</div>
            <p className="mt-2 text-xs text-primary font-semibold">(Assign Carefully)</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{totalActiveMembers} active members</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-chart-2/5 backdrop-blur-sm border-chart-2/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <ClipboardList className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Pending</div>
            <p className="mt-1 text-xs">
              <span className="text-destructive font-semibold">3 Overdue</span>
            </p>
            <Button 
              variant="link" 
              size="sm" 
              className="px-0 h-auto text-xs mt-2 text-chart-2 hover:text-chart-2/80"
              onClick={() => router.push('/maintenance')}
            >
              View Workflow →
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142 Units</div>
            <p className="mt-1 text-xs text-muted-foreground">98% Online tracking active</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Maintenance Reports</CardTitle>
            <CardDescription>Recent maintenance activities and their status</CardDescription>
          </div>
          <Button size="sm" className="gap-2" onClick={() => router.push('/maintenance')}>
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMaintenanceReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.subject}</TableCell>
                  <TableCell>{report.equipment}</TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell>{report.staff}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        report.status === "New" 
                          ? "secondary" 
                          : report.status === "In Progress" 
                          ? "default" 
                          : "outline"
                      }
                      className={
                        report.status === "New" 
                          ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30" 
                          : report.status === "In Progress"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                          : ""
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50 bg-card/30">
          <CardHeader>
            <CardTitle>Maintenance Activity</CardTitle>
            <CardDescription>Scheduled vs Corrective work orders over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end justify-between gap-2 px-6 pb-4">
            {/* Mock chart representation */}
            {[40, 65, 45, 90, 75, 55, 80, 60, 40, 95].map((h, i) => (
              <div key={i} className="flex-1 space-y-2">
                <div
                  className="w-full bg-primary/20 rounded-t-sm transition-all hover:bg-primary/40"
                  style={{ height: `${h}%` }}
                />
                <div
                  className="w-full bg-chart-2/40 rounded-t-sm transition-all hover:bg-chart-2/60"
                  style={{ height: `${h * 0.4}%` }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 border-border/50 bg-card/30">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { label: "AC Unit 04", status: "In Progress", user: "Mitchell Admin", time: "2h ago" },
                { label: "Conveyor Belt B", status: "Repaired", user: "Abigail Peterson", time: "5h ago" },
                { label: "Drill Press 12", status: "Scrapped", user: "Mitchell Admin", time: "1d ago" },
                { label: "Forklift H2", status: "Pending", user: "Internal Team", time: "2d ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      item.status === "In Progress"
                        ? "bg-primary"
                        : item.status === "Repaired"
                          ? "bg-chart-2"
                          : item.status === "Scrapped"
                            ? "bg-destructive"
                            : "bg-muted-foreground"
                    }`}
                  />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.user}</p>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{item.time}</div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-xs text-muted-foreground hover:text-foreground">
              View all logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
