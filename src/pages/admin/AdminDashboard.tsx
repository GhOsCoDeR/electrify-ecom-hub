
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, DollarSign, TrendingUp, Package } from "lucide-react";

const AdminDashboard = () => {
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
                <p className="text-3xl font-bold">124</p>
                <p className="text-sm text-green-500 mt-2">↑ 12% from last month</p>
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
                <p className="text-3xl font-bold">543</p>
                <p className="text-sm text-green-500 mt-2">↑ 5% from last month</p>
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
                <p className="text-3xl font-bold">$12,426</p>
                <p className="text-sm text-green-500 mt-2">↑ 8% from last month</p>
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
                <p className="text-3xl font-bold">76</p>
                <p className="text-sm text-orange-500 mt-2">↓ 2% from last month</p>
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
                <tr className="border-b">
                  <td className="py-3">#ORD-12345</td>
                  <td className="py-3">John Smith</td>
                  <td className="py-3"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Completed</span></td>
                  <td className="py-3">$129.99</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">#ORD-12346</td>
                  <td className="py-3">Lisa Johnson</td>
                  <td className="py-3"><span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Processing</span></td>
                  <td className="py-3">$249.50</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">#ORD-12347</td>
                  <td className="py-3">Michael Chen</td>
                  <td className="py-3"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Shipped</span></td>
                  <td className="py-3">$89.99</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">#ORD-12348</td>
                  <td className="py-3">Sarah Williams</td>
                  <td className="py-3"><span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Cancelled</span></td>
                  <td className="py-3">$59.95</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              {/* Placeholder for chart */}
              <div className="text-center text-gray-500">
                <TrendingUp size={64} className="mx-auto mb-4 text-electric-blue" />
                <p>Sales chart would be displayed here</p>
              </div>
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

export default AdminDashboard;
