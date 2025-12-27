"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Search, Users, CheckCircle, XCircle, Edit, Trash2, Star, Phone, Mail, MapPin } from "lucide-react"
import { VENDORS, type Vendor } from "@/lib/data"

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(VENDORS)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [formData, setFormData] = useState({
    vendorName: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    address: "",
    serviceCategory: [] as string[],
    contractValidity: "",
    rating: "4",
    isActive: true,
  })

  const activeVendors = vendors.filter(v => v.isActive).length
  const totalContracts = vendors.filter(v => v.contractValidity && new Date(v.contractValidity) > new Date()).length

  const filteredVendors = vendors.filter(vendor =>
    vendor.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.serviceCategory.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleAddOrUpdateVendor = () => {
    if (!formData.vendorName || !formData.contactPerson || !formData.phoneNumber || !formData.email) {
      alert("Please fill in all required fields")
      return
    }

    if (editingVendor) {
      // Update existing vendor
      setVendors(vendors =>
        vendors.map(vendor =>
          vendor.id === editingVendor.id
            ? {
                ...vendor,
                ...formData,
                rating: parseFloat(formData.rating),
              }
            : vendor
        )
      )
    } else {
      // Add new vendor
      const newVendor: Vendor = {
        id: `V-${String(vendors.length + 1).padStart(3, "0")}`,
        vendorName: formData.vendorName,
        contactPerson: formData.contactPerson,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        serviceCategory: formData.serviceCategory,
        contractValidity: formData.contractValidity,
        rating: parseFloat(formData.rating),
        isActive: formData.isActive,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setVendors([...vendors, newVendor])
    }

    setIsDialogOpen(false)
    setEditingVendor(null)
    resetForm()
  }

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setFormData({
      vendorName: vendor.vendorName,
      contactPerson: vendor.contactPerson,
      phoneNumber: vendor.phoneNumber,
      email: vendor.email,
      address: vendor.address,
      serviceCategory: vendor.serviceCategory,
      contractValidity: vendor.contractValidity || "",
      rating: vendor.rating?.toString() || "4",
      isActive: vendor.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (vendorId: string) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors => vendors.filter(v => v.id !== vendorId))
    }
  }

  const toggleVendorStatus = (vendorId: string) => {
    setVendors(vendors =>
      vendors.map(vendor =>
        vendor.id === vendorId ? { ...vendor, isActive: !vendor.isActive } : vendor
      )
    )
  }

  const resetForm = () => {
    setFormData({
      vendorName: "",
      contactPerson: "",
      phoneNumber: "",
      email: "",
      address: "",
      serviceCategory: [],
      contractValidity: "",
      rating: "4",
      isActive: true,
    })
  }

  const addServiceCategory = (category: string) => {
    if (category && !formData.serviceCategory.includes(category)) {
      setFormData({ ...formData, serviceCategory: [...formData.serviceCategory, category] })
    }
  }

  const removeServiceCategory = (category: string) => {
    setFormData({
      ...formData,
      serviceCategory: formData.serviceCategory.filter(c => c !== category)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors & Service Providers</h1>
          <p className="text-muted-foreground">Manage vendor relationships and contracts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingVendor(null)
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVendor ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
              <DialogDescription>
                {editingVendor ? "Update vendor details" : "Enter details for the new vendor"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="vendorName">Vendor Name *</Label>
                  <Input
                    id="vendorName"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    placeholder="e.g., HVAC Supplies Inc"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g., John Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+1-555-0000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@vendor.com"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label>Service Categories</Label>
                <div className="flex gap-2">
                  <Select onValueChange={addServiceCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add service category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HVAC">HVAC</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                      <SelectItem value="Production Equipment">Production Equipment</SelectItem>
                      <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                      <SelectItem value="Cleaning Services">Cleaning Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.serviceCategory.map((category) => (
                    <Badge key={category} variant="secondary" className="gap-1">
                      {category}
                      <button
                        type="button"
                        onClick={() => removeServiceCategory(category)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contractValidity">Contract Validity</Label>
                  <Input
                    id="contractValidity"
                    type="date"
                    value={formData.contractValidity}
                    onChange={(e) => setFormData({ ...formData, contractValidity: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isActive" className="font-normal cursor-pointer">
                  Active Vendor
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false)
                setEditingVendor(null)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddOrUpdateVendor}>
                {editingVendor ? "Update" : "Add"} Vendor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <CheckCircle className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{activeVendors}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valid Contracts</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">Active contracts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(vendors.reduce((sum, v) => sum + (v.rating || 0), 0) / vendors.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vendor Directory</CardTitle>
              <CardDescription>Manage all vendor relationships</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
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
                <TableHead>Vendor Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Service Categories</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No vendors found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.vendorName}</TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{vendor.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{vendor.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {vendor.serviceCategory.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                        {vendor.serviceCategory.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{vendor.serviceCategory.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">{vendor.rating?.toFixed(1) || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {vendor.contractValidity ? (
                        <span className={new Date(vendor.contractValidity) < new Date() ? "text-destructive" : "text-muted-foreground"}>
                          {new Date(vendor.contractValidity).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No contract</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {vendor.isActive ? (
                        <Badge variant="secondary" className="bg-chart-2/10 text-chart-2 border-chart-2/30">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-muted">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleVendorStatus(vendor.id)}
                          title={vendor.isActive ? "Deactivate" : "Activate"}
                        >
                          {vendor.isActive ? (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-chart-2" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(vendor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(vendor.id)}>
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
