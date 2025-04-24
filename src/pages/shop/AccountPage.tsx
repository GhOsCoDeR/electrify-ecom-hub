import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import { Package, User, Settings, ShoppingBag, Star, Loader2, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { updateUserProfile } from "@/lib/database";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);
  
  // Form states
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false
  });
  
  // Orders state
  const [orders, setOrders] = useState<any[]>([]);

  // Fetch user data when profile is loaded
  useEffect(() => {
    if (profile) {
      setUserData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zipCode: profile.postal_code || ""
      });
    }
    
    // Fetch orders if user is logged in
    if (user?.id) {
      fetchOrders(user.id);
    }
  }, [profile, user]);

  // Set up real-time subscription for order updates
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to changes on the orders table for this user
    const subscription = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Order updated:', payload);
          // Update the order in the local state
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === payload.new.id 
                ? { ...order, ...payload.new } 
                : order
            )
          );

          // Show a toast notification
          toast({
            title: "Order status updated",
            description: `Order #${payload.new.id} is now ${payload.new.status}`,
          });
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id, toast]);

  // Fetch orders from the database
  const fetchOrders = async (userId: string) => {
    setIsLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
          variant: "destructive"
        });
      } else {
        console.log("Orders fetched:", data);
        setOrders(data || []);
      }
    } catch (error) {
      console.error("Exception fetching orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };
  
  // Refresh orders manually
  const refreshOrders = async () => {
    if (!user?.id) return;
    
    setIsRefreshingOrders(true);
    await fetchOrders(user.id);
    setIsRefreshingOrders(false);
    
    toast({
      title: "Orders refreshed",
      description: "Your order information has been updated.",
    });
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';  // pending or other status
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You need to be logged in to update your profile.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const updatedProfile = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        postal_code: userData.zipCode
      };
      
      const result = await updateUserProfile(user.id, updatedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      
      // Refresh the page to update the context
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error", 
        description: "New passwords don't match.",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error", 
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPasswordUpdating(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully."
      });
      
      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  // Handle notification toggle
  const handleToggleNotification = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast({
      title: "Setting updated",
      description: `Notification setting has been updated.`
    });
  };

  // Handle account actions
  const handleDownloadData = () => {
    toast({
      title: "Download initiated",
      description: "Your data will be prepared and downloaded shortly."
    });
  };
  
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (confirmed) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(user!.id);
        
        if (error) throw error;
        
        toast({
          title: "Account deleted",
          description: "Your account has been deleted successfully."
        });
        
        // Redirect to home page
        navigate("/");
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete account. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Redirect if not logged in
  if (!user) {
    return (
      <WebsiteLayout>
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your account</h1>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </div>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-electric-darkgray mb-8">My Account</h1>
        
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="mb-8 flex flex-wrap">
            <TabsTrigger value="orders" className="flex items-center">
              <ShoppingBag size={16} className="mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <User size={16} className="mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings size={16} className="mr-2" />
              Account Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshOrders} 
                disabled={isRefreshingOrders || isLoadingOrders}
                className="flex items-center"
              >
                {isRefreshingOrders ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw size={16} className="mr-2" />
                )}
                Refresh Orders
              </Button>
            </div>
            
            {isLoadingOrders ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
                <span className="ml-2">Loading your orders...</span>
              </div>
            ) : orders.length > 0 ? (
              orders.map(order => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">Order #{order.id}</h3>
                        <p className="text-gray-500">Ordered on {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-2 md:mt-0 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${getStatusBadgeClass(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className="ml-4 font-medium">${Number(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Separator className="mb-4" />
                    
                    <div className="space-y-3">
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <p>{item.products?.name || 'Product not available'}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p>${Number(item.price).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center"
                        disabled={order.status === 'cancelled'}
                      >
                        <Package size={16} className="mr-2" />
                        {order.status === 'delivered' ? 'View Details' : 'Track Order'}
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Star size={16} className="mr-2" />
                          Write Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  <Button onClick={() => navigate("/shop")}>Start Shopping</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={userData.address}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={userData.city}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={userData.state}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={userData.zipCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-electric-blue text-white hover:bg-blue-700"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4">Password</h3>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          name="currentPassword"
                          type="password" 
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          name="newPassword"
                          type="password" 
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          name="confirmPassword"
                          type="password" 
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <Button 
                        type="submit"
                        disabled={isPasswordUpdating}
                      >
                        {isPasswordUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : "Change Password"}
                      </Button>
                    </form>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-bold mb-4">Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant={notificationSettings.emailNotifications ? "default" : "outline"} 
                            size="sm"
                            onClick={() => !notificationSettings.emailNotifications && handleToggleNotification('emailNotifications')}
                          >
                            On
                          </Button>
                          <Button 
                            variant={!notificationSettings.emailNotifications ? "default" : "outline"} 
                            size="sm"
                            onClick={() => notificationSettings.emailNotifications && handleToggleNotification('emailNotifications')}
                          >
                            Off
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="orderUpdates">Order Updates</Label>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant={notificationSettings.orderUpdates ? "default" : "outline"} 
                            size="sm"
                            onClick={() => !notificationSettings.orderUpdates && handleToggleNotification('orderUpdates')}
                          >
                            On
                          </Button>
                          <Button 
                            variant={!notificationSettings.orderUpdates ? "default" : "outline"} 
                            size="sm"
                            onClick={() => notificationSettings.orderUpdates && handleToggleNotification('orderUpdates')}
                          >
                            Off
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="promotions">Promotional Emails</Label>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant={notificationSettings.promotions ? "default" : "outline"} 
                            size="sm"
                            onClick={() => !notificationSettings.promotions && handleToggleNotification('promotions')}
                          >
                            On
                          </Button>
                          <Button 
                            variant={!notificationSettings.promotions ? "default" : "outline"} 
                            size="sm"
                            onClick={() => notificationSettings.promotions && handleToggleNotification('promotions')}
                          >
                            Off
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-bold mb-4">Account Actions</h3>
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        onClick={handleDownloadData}
                      >
                        Download My Data
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </WebsiteLayout>
  );
};

export default AccountPage;
