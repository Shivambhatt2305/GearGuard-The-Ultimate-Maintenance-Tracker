"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [name, setName] = React.useState("John Doe")
  const [email, setEmail] = React.useState("john.doe@example.com")
  const [theme, setTheme] = React.useState("system")
  const [timezone, setTimezone] = React.useState("UTC")
  const [dateFormat, setDateFormat] = React.useState("YYYY-MM-DD")
  const [notifyEmail, setNotifyEmail] = React.useState(true)
  const [notifyDesktop, setNotifyDesktop] = React.useState(true)
  const [notifyCritical, setNotifyCritical] = React.useState(true)

  const handleSave = () => {
    // For now, just simulate a save action
    console.log("Settings saved", {
      name,
      email,
      theme,
      timezone,
      dateFormat,
      notifyEmail,
      notifyDesktop,
      notifyCritical,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage preferences and organization settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/30">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/30">
          <CardHeader>
            <CardTitle>Theme & Display</CardTitle>
            <CardDescription>Choose your preferred look and feel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Date Format</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/30">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Control how you get alerted.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates about requests and assignments.</p>
            </div>
            <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Desktop alerts</p>
              <p className="text-xs text-muted-foreground">Show quick alerts in your browser.</p>
            </div>
            <Switch checked={notifyDesktop} onCheckedChange={setNotifyDesktop} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Critical incident push</p>
              <p className="text-xs text-muted-foreground">Always notify for urgent issues.</p>
            </div>
            <Switch checked={notifyCritical} onCheckedChange={setNotifyCritical} />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="bg-transparent" onClick={handleSave}>Update Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
