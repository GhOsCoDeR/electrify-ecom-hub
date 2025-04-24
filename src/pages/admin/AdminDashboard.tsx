
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, DollarSign, TrendingUp, Package, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalProducts: 0,
    orderGrowth: 0,
    userGrowth: 0,
    revenueGrowth: 0,
    productGrowth: 0,
    recentOrders: [],
    topProducts: [],
    salesData: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch total products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, price');
        
        if (productsError) throw productsError;
        
        // Fetch total users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id');
        
        if (usersError) throw usersError;
        
        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id, 
            total, 
            status, 
            created_at,
            users (first_name, last_name, email)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (ordersError) throw ordersError;

        // Transform data
        const totalProducts = productsData?.length || 0;
        const totalUsers = usersData?.length || 0;
        const totalOrders = ordersData?.length || 0;
        const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

        // Create simple sales data for chart
        const salesData = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        for (let i = 0; i < months.length; i++) {
          salesData.push({
            name: months[i],
            value: Math.floor(Math.random() * 10000)
          });
        }

        // Transform recent orders
        const recentOrders = ordersData?.map(order => ({
          id: `#ORD-${order.id.toString().padStart(5, '0')}`,
          customerName: `${order.users?.first_name || ''} ${order.users?.last_name || ''}`.trim() || 'Unknown Customer',
          customerEmail: order.users?.email || 'No email',
          status: order.status,
          amount: Number(order.total).toFixed(2),
          date: new Date(order.created_at).toLocaleDateString()
        })) || [];

        setDashboardData({
          totalOrders,
          totalUsers,
          totalRevenue,
          totalProducts,
          orderGrowth: 12,  // Placeholder - would need historical data
          userGrowth: 5,    // Placeholder
          revenueGrowth: 8, // Placeholder
          productGrowth: -2, // Placeholder
          recentOrders,
          topProducts: [], // Would need to join with order items
          salesData
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
          <span className="ml-2">Loading dashboard data...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin User!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-3xl font-bold">{dashboardData.totalOrders}</p>
                <p className="text-sm text-green-500 mt-2">↑ {dashboardData.orderGrowth}% from last month</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-electric-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-3xl font-bold">{dashboardData.totalUsers}</p>
                <p className="text-sm text-green-500 mt-2">↑ {dashboardData.userGrowth}% from last month</p>
              </div>
              <div className="p-4 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-3xl font-bold">${dashboardData.totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-green-500 mt-2">↑ {dashboardData.revenueGrowth}% from last month</p>
              </div>
              <div className="p-4 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-3xl font-bold">{dashboardData.totalProducts}</p>
                <p className="text-sm text-orange-500 mt-2">↓ {Math.abs(dashboardData.productGrowth)}% from last month</p>
              </div>
              <div className="p-4 bg-orange-100 rounded-full">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Sales Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentOrders.length > 0 ? (
                  dashboardData.recentOrders.slice(0, 4).map((order: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">{order.id}</td>
                      <td className="py-3">{order.customerName}</td>
                      <td className="py-3">
                        <span className={`bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800 text-xs px-2 py-1 rounded`}>
                          {capitalizeFirstLetter(order.status)}
                        </span>
                      </td>
                      <td className="py-3">${order.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-3 text-center text-gray-500">No recent orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar dataKey="value" fill="#3b82f6" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Product</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Sold</th>
                <th className="pb-2">Revenue</th>
                <th className="pb-2">In Stock</th>
              </tr>
            </thead>
            <tbody>
              {/* This would ideally be populated from real data */}
              <tr className="border-b">
                <td className="py-3">Smart LED Bulb</td>
                <td className="py-3">Lighting</td>
                <td className="py-3">124 units</td>
                <td className="py-3">$3,099.76</td>
                <td className="py-3">45 units</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Wireless Vacuum Cleaner</td>
                <td className="py-3">Home Appliances</td>
                <td className="py-3">78 units</td>
                <td className="py-3">$15,599.22</td>
                <td className="py-3">12 units</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Smart Home Hub</td>
                <td className="py-3">Smart Devices</td>
                <td className="py-3">67 units</td>
                <td className="py-3">$10,049.33</td>
                <td className="py-3">23 units</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Electric Coffee Maker</td>
                <td className="py-3">Kitchen Appliances</td>
                <td className="py-3">52 units</td>
                <td className="py-3">$4,679.48</td>
                <td className="py-3">34 units</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

// Helper functions
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'green';
    case 'processing': return 'yellow';
    case 'shipped': return 'blue';
    case 'cancelled': return 'red';
    default: return 'gray';
  }
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default AdminDashboard;
