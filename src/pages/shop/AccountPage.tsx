
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import { Package, User, Settings, ShoppingBag, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AccountPage = () => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock user data - in a real app, this would come from context/state/API
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001"
  });

  // Mock orders
  const orders = [
    { 
      id: "ORD-2023-001", 
      date: "2023-04-15", 
      total: 357.37,
      status: "Delivered",
      items: [
        { name: "Premium Electric Mixer", quantity: 1, price: 249.99 },
        { name: "Smart LED Bulb", quantity: 2, price: 34.99 }
      ]
    },
    { 
      id: "ORD-2023-002", 
      date: "2023-03-22", 
      total: 129.95,
      status: "Processing",
      items: [
        { name: "Wireless Power Strip", quantity: 1, price: 129.95 }
      ]
    }
  ];

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulate API request
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      setIsUpdating(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

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
            {orders.map(order => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{order.id}</h3>
                      <p className="text-gray-500">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {order.status}
                      </span>
                      <span className="ml-4 font-medium">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator className="mb-4" />
                  
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <p>{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Package size={16} className="mr-2" />
                      Track Order
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Star size={16} className="mr-2" />
                      Write Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {orders.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">You haven't placed any orders yet.</p>
                  <Button className="mt-4">Start Shopping</Button>
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
                        onChange={handleChange}
                      />
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
                    {isUpdating ? "Updating..." : "Update Profile"}
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
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      <Button>Change Password</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-bold mb-4">Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">On</Button>
                          <Button variant="outline" size="sm">Off</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="orderUpdates">Order Updates</Label>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">On</Button>
                          <Button variant="outline" size="sm">Off</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="promotions">Promotional Emails</Label>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">On</Button>
                          <Button variant="outline" size="sm">Off</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-bold mb-4">Account Actions</h3>
                    <div className="space-y-4">
                      <Button variant="outline">Download My Data</Button>
                      <Button variant="destructive">Delete Account</Button>
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
