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
import { 
  INITIAL_TEAMS, 
  EQUIPMENT_DATABASE, 
  MAINTENANCE_LOGS, 
  SPARE_PARTS,
  NOTIFICATIONS,
  getLowStockParts,
  getUnreadNotifications,
  getOverdueMaintenance,
  getUpcomingMaintenance 
} from "@/lib/data"
import { formatDate, formatNumber } from "@/lib/utils"

// Helper lookups for dashboard table
const allMembers = INITIAL_TEAMS.flatMap(t => t.members)
const getMemberNameByLogin = (loginId: string) => allMembers.find(m => m.loginId === loginId)?.name ?? loginId

const recentMaintenanceReports = MAINTENANCE_LOGS.slice(0, 5).map(log => {
  const equipment = EQUIPMENT_DATABASE.find(eq => eq.id === log.assetId)
  const firstSentence = log.workDescription.split(".")[0]
  return {
    id: log.id,
    subject: firstSentence.length > 0 ? firstSentence : log.workDescription.substring(0, 50) + "...",
    employee: getMemberNameByLogin(log.createdBy),
    technician: log.technicianName,
    category: equipment?.category ?? log.maintenanceType,
    stage: log.status === "Pending" ? "New Request" : log.status,
    company: equipment?.company ?? "—",
    date: log.maintenanceDate,
  }
})

export default function DashboardPage() {
  const router = useRouter()
  const totalActiveMembers = INITIAL_TEAMS.flatMap(t => t.members).filter(m => m.status === "Active").length
  const criticalEquipment = EQUIPMENT_DATABASE.filter(eq => eq.status === "Under Repair" || eq.status === "Maintenance").length
  const totalMaintenanceCost = MAINTENANCE_LOGS.filter(l => l.status === "Completed").reduce((sum, log) => sum + log.totalCost, 0)
  const lowStockCount = getLowStockParts().length
  const unreadNotifications = getUnreadNotifications().length
  const overdueCount = getOverdueMaintenance().length
  const upcomingCount = getUpcomingMaintenance().length

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
            <div className="text-2xl font-bold">{criticalEquipment} Units</div>
            <p className="mt-2 text-xs text-destructive font-semibold">(Under Repair/Maintenance)</p>
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
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveMembers}</div>
            <p className="mt-2 text-xs text-primary font-semibold">Available for assignments</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Across {INITIAL_TEAMS.length} teams</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-chart-2/5 backdrop-blur-sm border-chart-2/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Status</CardTitle>
            <ClipboardList className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueCount} Overdue</div>
            <p className="mt-1 text-xs">
              <span className="text-chart-2 font-semibold">{upcomingCount} Upcoming</span>
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
            <div className="text-2xl font-bold">{EQUIPMENT_DATABASE.length} Units</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Cost: ${formatNumber(totalMaintenanceCost)}
            </p>
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
                <TableHead>Subjects</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Company</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMaintenanceReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.subject}</TableCell>
                  <TableCell>{report.employee}</TableCell>
                  <TableCell>{report.technician}</TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        report.stage === "New Request" 
                          ? "secondary" 
                          : report.stage === "In Progress" 
                          ? "default" 
                          : "outline"
                      }
                      className={
                        report.stage === "New Request" 
                          ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30" 
                          : report.stage === "In Progress"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                          : "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30"
                      }
                    >
                      {report.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.company}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notifications & Alerts */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notifications & Alerts</CardTitle>
            <CardDescription>System alerts and important updates</CardDescription>
          </div>
          <Badge variant="destructive">{unreadNotifications} Unread</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {NOTIFICATIONS.filter(n => !n.isRead).slice(0, 5).map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className={`p-2 rounded-full ${
                  notification.priority === "High" 
                    ? "bg-destructive/10 text-destructive" 
                    : notification.priority === "Medium"
                    ? "bg-yellow-500/10 text-yellow-600"
                    : "bg-primary/10 text-primary"
                }`}>
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
                </div>
                <Badge variant={notification.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                  {notification.priority}
                </Badge>
              </div>
            ))}
          </div>
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
