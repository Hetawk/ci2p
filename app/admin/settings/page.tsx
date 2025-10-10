import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, Building2, Mail, Globe, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure lab information and system settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Lab Information
            </CardTitle>
            <CardDescription>
              Update your research lab&apos;s basic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lab-name">Lab Name</Label>
              <Input
                id="lab-name"
                defaultValue="CI2P Research Lab"
                placeholder="Enter lab name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lab-description">Description</Label>
              <Input
                id="lab-description"
                defaultValue="Computational Intelligence and Intelligent Processing"
                placeholder="Enter lab description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lab-location">Location</Label>
              <Input
                id="lab-location"
                defaultValue="University of Jinan, Shandong, China"
                placeholder="Enter lab location"
              />
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Manage contact details for your lab
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                type="email"
                defaultValue="ise_niusj@ujn.edu.cn"
                placeholder="Enter contact email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone Number</Label>
              <Input
                id="contact-phone"
                defaultValue="0531-82767569"
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-address">Office Address</Label>
              <Input
                id="contact-address"
                defaultValue="School of Information Science and Engineering"
                placeholder="Enter office address"
              />
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Social Media Links
            </CardTitle>
            <CardDescription>
              Configure social media and academic profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="google-scholar">Google Scholar</Label>
              <Input
                id="google-scholar"
                placeholder="Google Scholar profile URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="researchgate">ResearchGate</Label>
              <Input id="researchgate" placeholder="ResearchGate profile URL" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" placeholder="GitHub organization URL" />
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage authentication and security options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                defaultValue="60"
                placeholder="Enter session timeout"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-policy">Minimum Password Length</Label>
              <Input
                id="password-policy"
                type="number"
                defaultValue="8"
                placeholder="Enter minimum password length"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Verification</Label>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
                <Button variant="ghost" size="sm">
                  Disabled
                </Button>
              </div>
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database Status</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Backup</span>
              <span className="font-medium">Today, 2:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Records</span>
              <span className="font-medium">150+</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
