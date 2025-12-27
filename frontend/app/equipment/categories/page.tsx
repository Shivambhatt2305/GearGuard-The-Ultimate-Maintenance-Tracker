"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { EQUIPMENT_CATEGORIES, INITIAL_TEAMS } from "@/lib/data"

export default function EquipmentCategoriesPage() {
  const [categories, setCategories] = useState(EQUIPMENT_CATEGORIES)
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [form, setForm] = useState({ name: "", responsible: "", company: "My Company (San Francisco)" })

  const activeMembers = INITIAL_TEAMS.flatMap(t => t.members).filter(m => m.status === "Active")

  const handleAdd = () => {
    if (!form.name || !form.responsible || !form.company) return
    const next = { id: `EC-${String(categories.length + 1).padStart(3, "0")}`, ...form }
    setCategories(prev => [...prev, next])
    setIsNewOpen(false)
    setForm({ name: "", responsible: "", company: "My Company (San Francisco)" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Equipment Categories</h1>
        <Button className="gap-2" onClick={() => setIsNewOpen(true)}>
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      <Card className="border-border/50 bg-card/30">
        <CardHeader>
          <CardTitle className="text-base">Equipment Categories</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50">
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Responsible</TableHead>
                <TableHead>Company</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(cat => (
                <TableRow key={cat.id} className="border-border/50">
                  <TableCell className="pl-6 font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.responsible}</TableCell>
                  <TableCell className="text-muted-foreground">{cat.company}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
            <DialogDescription>Define a new equipment category</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Computers" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="responsible">Responsible</Label>
              <Input id="responsible" list="members" value={form.responsible} onChange={e => setForm({ ...form, responsible: e.target.value })} placeholder="Select or type" />
              <datalist id="members">
                {activeMembers.map(m => (
                  <option key={m.id} value={m.name} />
                ))}
                <option value="OdooBot" />
              </datalist>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="My Company (San Francisco)" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
