
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Define a settings type
interface StoreSettings {
  storeName: string;
  contactEmail: string;
  emailNotifications: boolean;
  maintenanceMode: boolean;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "ElectriCo Store",
    contactEmail: "admin@electrico.com",
    emailNotifications: true,
    maintenanceMode: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    twoFactorAuth: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch settings from the database
  useEffect(() => {
    // In a real application, you would fetch settings from the database
    // For now, we'll simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // In a real application, you would save settings to the database
      // For now, we'll simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully."
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!securitySettings.currentPassword || !securitySettings.newPassword) {
      toast({
        title: "Validation Error",
        description: "Please provide both current and new passwords.",
        variant: "destructive"
      });
      return;
    }
    
    if (securitySettings.newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: securitySettings.newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully."
      });
      
      // Clear password fields
      setSecuritySettings(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: ""
      }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const toggleTwoFactor = () => {
    setSecuritySettings(prev => ({
      ...prev,
      twoFactorAuth: !prev.twoFactorAuth
    }));
    
    toast({
      title: `Two-Factor Authentication ${securitySettings.twoFactorAuth ? "disabled" : "enabled"}`,
      description: `Two-factor authentication has been ${securitySettings.twoFactorAuth ? "disabled" : "enabled"} for your account.`
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
          <span className="ml-2">Loading settings...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your admin panel settings</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input 
                  id="storeName" 
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleSettingChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input 
                  id="contactEmail" 
                  name="contactEmail"
                  type="email" 
                  value={settings.contactEmail}
                  onChange={handleSettingChange}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email notifications for new orders</p>
                </div>
                <Switch 
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Put store in maintenance mode</p>
                </div>
                <Switch 
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                />
              </div>
              
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="mt-4"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  name="currentPassword"
                  type="password"
                  value={securitySettings.currentPassword}
                  onChange={handleSecurityChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  name="newPassword"
                  type="password"
                  value={securitySettings.newPassword}
                  onChange={handleSecurityChange}
                />
              </div>
              
              <Button 
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : "Change Password"}
              </Button>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Switch 
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={toggleTwoFactor}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
