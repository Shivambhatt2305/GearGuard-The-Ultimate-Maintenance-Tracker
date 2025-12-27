import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUpRight, ArrowDownRight, Activity, Box, ClipboardList, AlertCircle } from "lucide-react"

export default function DashboardPage() {
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
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Equipment</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Assets</div>
            <div className="flex items-center pt-1 text-xs text-destructive">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +20% from last week
            </div>
            <p className="mt-2 text-xs text-muted-foreground font-medium">Health: {"<"} 30%</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Technician Load</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85% Utilized</div>
            <div className="flex items-center pt-1 text-xs text-primary">
              <ArrowDownRight className="mr-1 h-3 w-3" />
              -5% improvement
            </div>
            <p className="mt-2 text-xs text-muted-foreground font-medium">Design Capacity</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <ClipboardList className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Pending</div>
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="text-chart-2 font-bold">3 Overdue</span> | 9 within SLA
            </p>
            <div className="mt-3 h-1 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-chart-2 w-3/4" />
            </div>
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
