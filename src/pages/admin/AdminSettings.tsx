
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
  id?: string;
  store_name: string;
  contact_email: string;
  logo_url?: string;
  favicon_url?: string;
  email_notifications: boolean;
  maintenance_mode: boolean;
  currency: string;
  tax_rate: number;
  shipping_fee: number;
  enable_guest_checkout: boolean;
  theme_color: string;
  created_at?: string;
  updated_at?: string;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  twoFactorAuth: boolean;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: "ElectriCo Store",
    contact_email: "admin@electrico.com",
    email_notifications: true,
    maintenance_mode: false,
    currency: "USD",
    tax_rate: 7.5,
    shipping_fee: 5.99,
    enable_guest_checkout: true,
    theme_color: "#3b82f6"
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    currentPassword: "",
    newPassword: "",
    twoFactorAuth: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch settings from the database
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }
        
        if (data) {
          setSettings({
            id: data.id,
            store_name: data.store_name,
            contact_email: data.contact_email,
            logo_url: data.logo_url,
            favicon_url: data.favicon_url,
            email_notifications: data.email_notifications,
            maintenance_mode: data.maintenance_mode,
            currency: data.currency,
            tax_rate: data.tax_rate,
            shipping_fee: data.shipping_fee,
            enable_guest_checkout: data.enable_guest_checkout,
            theme_color: data.theme_color,
            created_at: data.created_at,
            updated_at: data.updated_at
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error",
          description: "Failed to fetch settings. Using default values.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [toast]);

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : 
              name === "tax_rate" || name === "shipping_fee" ? parseFloat(value) : value
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
      const { store_name, contact_email, email_notifications, maintenance_mode,
              currency, tax_rate, shipping_fee, enable_guest_checkout, theme_color } = settings;
      
      const settingsData = {
        store_name,
        contact_email,
        email_notifications,
        maintenance_mode,
        currency,
        tax_rate,
        shipping_fee,
        enable_guest_checkout,
        theme_color,
        updated_at: new Date().toISOString()
      };
      
      if (settings.id) {
        // Update existing settings
        const { error } = await supabase
          .from('store_settings')
          .update(settingsData)
          .eq('id', settings.id);
        
        if (error) throw error;
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from('store_settings')
          .insert([settingsData])
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state with the new ID
        setSettings(prev => ({
          ...prev,
          id: data.id,
          created_at: data.created_at,
          updated_at: data.updated_at
        }));
      }
      
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully."
      });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save settings. Please try again.",
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
                <Label htmlFor="store_name">Store Name</Label>
                <Input 
                  id="store_name" 
                  name="store_name"
                  value={settings.store_name}
                  onChange={handleSettingChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input 
                  id="contact_email" 
                  name="contact_email"
                  type="email" 
                  value={settings.contact_email}
                  onChange={handleSettingChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme_color">Theme Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="theme_color" 
                    name="theme_color"
                    type="color" 
                    value={settings.theme_color}
                    onChange={handleSettingChange}
                    className="w-16 h-10 p-1"
                  />
                  <Input 
                    value={settings.theme_color}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input 
                    id="currency" 
                    name="currency"
                    value={settings.currency}
                    onChange={handleSettingChange}
                    maxLength={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input 
                    id="tax_rate" 
                    name="tax_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.tax_rate}
                    onChange={handleSettingChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shipping_fee">Default Shipping Fee ($)</Label>
                  <Input 
                    id="shipping_fee" 
                    name="shipping_fee"
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.shipping_fee}
                    onChange={handleSettingChange}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email notifications for new orders</p>
                </div>
                <Switch 
                  name="email_notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_notifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Put store in maintenance mode</p>
                </div>
                <Switch 
                  name="maintenance_mode"
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenance_mode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Guest Checkout</Label>
                  <p className="text-sm text-gray-500">Allow checkout without account</p>
                </div>
                <Switch 
                  name="enable_guest_checkout"
                  checked={settings.enable_guest_checkout}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_guest_checkout: checked }))}
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
