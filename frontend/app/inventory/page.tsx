"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Package, AlertTriangle, TrendingUp, Edit, Trash2 } from "lucide-react"
import { SPARE_PARTS, VENDORS, getLowStockParts, type SparePart } from "@/lib/data"

export default function InventoryPage() {
  const [spareParts, setSpareParts] = useState<SparePart[]>(SPARE_PARTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPart, setEditingPart] = useState<SparePart | null>(null)
  const [formData, setFormData] = useState({
    partName: "",
    partNumber: "",
    category: "",
    quantityAvailable: "",
    minimumThreshold: "",
    costPerUnit: "",
    supplierName: "",
    location: "",
  })

  const lowStockParts = getLowStockParts()
  const totalValue = spareParts.reduce((sum, part) => sum + (part.quantityAvailable * part.costPerUnit), 0)
  const lowStockValue = lowStockParts.reduce((sum, part) => sum + (part.quantityAvailable * part.costPerUnit), 0)

  const filteredParts = spareParts.filter(part =>
    part.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddOrUpdatePart = () => {
    if (!formData.partName || !formData.partNumber || !formData.quantityAvailable) {
      alert("Please fill in all required fields")
      return
    }

    if (editingPart) {
      // Update existing part
      setSpareParts(parts =>
        parts.map(part =>
          part.id === editingPart.id
            ? {
                ...part,
                ...formData,
                quantityAvailable: parseInt(formData.quantityAvailable),
                minimumThreshold: parseInt(formData.minimumThreshold),
                costPerUnit: parseFloat(formData.costPerUnit),
                lastRestocked: new Date().toISOString().split("T")[0],
              }
            : part
        )
      )
    } else {
      // Add new part
      const newPart: SparePart = {
        id: `SP-${String(spareParts.length + 1).padStart(3, "0")}`,
        partName: formData.partName,
        partNumber: formData.partNumber,
        category: formData.category,
        quantityAvailable: parseInt(formData.quantityAvailable),
        minimumThreshold: parseInt(formData.minimumThreshold),
        costPerUnit: parseFloat(formData.costPerUnit),
        supplierName: formData.supplierName,
        location: formData.location,
        lastRestocked: new Date().toISOString().split("T")[0],
      }
      setSpareParts([...spareParts, newPart])
    }

    setIsDialogOpen(false)
    setEditingPart(null)
    resetForm()
  }

  const handleEdit = (part: SparePart) => {
    setEditingPart(part)
    setFormData({
      partName: part.partName,
      partNumber: part.partNumber,
      category: part.category,
      quantityAvailable: part.quantityAvailable.toString(),
      minimumThreshold: part.minimumThreshold.toString(),
      costPerUnit: part.costPerUnit.toString(),
      supplierName: part.supplierName || "",
      location: part.location || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (partId: string) => {
    if (confirm("Are you sure you want to delete this spare part?")) {
      setSpareParts(parts => parts.filter(p => p.id !== partId))
    }
  }

  const resetForm = () => {
    setFormData({
      partName: "",
      partNumber: "",
      category: "",
      quantityAvailable: "",
      minimumThreshold: "",
      costPerUnit: "",
      supplierName: "",
      location: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Manage spare parts and track stock levels</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingPart(null)
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Spare Part
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPart ? "Edit Spare Part" : "Add New Spare Part"}</DialogTitle>
              <DialogDescription>
                {editingPart ? "Update spare part details" : "Enter details for the new spare part"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="partName">Part Name *</Label>
                  <Input
                    id="partName"
                    value={formData.partName}
                    onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                    placeholder="e.g., Air Filter"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="partNumber">Part Number *</Label>
                  <Input
                    id="partNumber"
                    value={formData.partNumber}
                    onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                    placeholder="e.g., AF-2024-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HVAC">HVAC</SelectItem>
                      <SelectItem value="Fluids">Fluids</SelectItem>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplierName">Supplier</Label>
                  <Select value={formData.supplierName} onValueChange={(value) => setFormData({ ...formData, supplierName: value })}>
                    <SelectTrigger id="supplierName">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {VENDORS.filter(v => v.isActive).map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.vendorName}>
                          {vendor.vendorName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantityAvailable">Quantity *</Label>
                  <Input
                    id="quantityAvailable"
                    type="number"
                    min="0"
                    value={formData.quantityAvailable}
                    onChange={(e) => setFormData({ ...formData, quantityAvailable: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minimumThreshold">Min. Threshold</Label>
                  <Input
                    id="minimumThreshold"
                    type="number"
                    min="0"
                    value={formData.minimumThreshold}
                    onChange={(e) => setFormData({ ...formData, minimumThreshold: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="costPerUnit">Cost/Unit ($)</Label>
                  <Input
                    id="costPerUnit"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Storage Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Warehouse A, Shelf 3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false)
                setEditingPart(null)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddOrUpdatePart}>
                {editingPart ? "Update" : "Add"} Part
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spareParts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Current inventory value</p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/5 border-destructive/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockParts.length}</div>
            <p className="text-xs text-destructive font-semibold mt-1">Needs restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${lowStockValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Value at risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Spare Parts Inventory</CardTitle>
              <CardDescription>Track and manage all spare parts</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search parts..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Name</TableHead>
                <TableHead>Part Number</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost/Unit</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No spare parts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredParts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell className="font-medium">{part.partName}</TableCell>
                    <TableCell className="font-mono text-xs">{part.partNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{part.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={part.quantityAvailable < part.minimumThreshold ? "text-destructive font-semibold" : ""}>
                        {part.quantityAvailable}
                      </span>
                    </TableCell>
                    <TableCell>
                      {part.quantityAvailable < part.minimumThreshold ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="secondary">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>${part.costPerUnit.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">
                      ${(part.quantityAvailable * part.costPerUnit).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {part.supplierName || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(part)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(part.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

