import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Factory, Activity, Gauge } from "lucide-react"


const workCenters = [
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

export default function WorkCentersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Work Centers</h1>
          <p className="text-sm text-muted-foreground">Monitor production line efficiency and maintenance impact.</p>
        </div>
        <Button className="gap-2">
          <Factory className="h-4 w-4" />
          Register Center
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/30 border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Avg. Efficiency
              </span>
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.8%</div>
            <p className="text-[10px] text-primary pt-1 font-medium">↑ 1.2% from last shift</p>
          </CardContent>
        </Card>
        <Card className="bg-card/30 border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Capacity</span>
              <Gauge className="h-4 w-4 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">320 Units/hr</div>
            <p className="text-[10px] text-muted-foreground pt-1">Operating at 88% load</p>
          </CardContent>
        </Card>
        <Card className="bg-card/30 border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Down Centers</span>
              <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 Active</div>
            <p className="text-[10px] text-muted-foreground pt-1">All lines operational</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/30">
        <CardContent className="px-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="pl-6 w-[100px]">Code</TableHead>
                <TableHead>Work Center Tag</TableHead>
                <TableHead>Alt. Center</TableHead>
                <TableHead className="text-right">Cost/hr</TableHead>
                <TableHead className="text-right">Cap. Time Eff.</TableHead>
                <TableHead className="text-right pr-6">OEE Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workCenters.map((wc) => (
                <TableRow key={wc.code} className="border-border/50 hover:bg-accent/10 transition-colors">
                  <TableCell className="font-mono text-xs pl-6">{wc.code}</TableCell>
                  <TableCell className="font-medium">{wc.tag}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-border/50 font-normal">
                      {wc.alternative}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm font-mono">${wc.costPerHour.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-medium">{wc.efficiency}%</span>
                      <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${wc.efficiency > 90 ? "bg-chart-2" : "bg-primary"}`}
                          style={{ width: `${wc.efficiency}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Badge className="bg-muted text-muted-foreground border-transparent font-mono text-[10px]">
                      {wc.oeeTarget}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
