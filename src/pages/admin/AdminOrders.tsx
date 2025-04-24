
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { Search, Eye, Package, Truck, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  address: string;
  payment_method: string;
}

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, 
          total, 
          status, 
          created_at,
          user_id,
          users (
            id,
            email, 
            first_name, 
            last_name, 
            address,
            city,
            state,
            postal_code,
            country
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Get order items for each order
      const ordersWithItems = await Promise.all(
        data.map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              id,
              product_id,
              quantity,
              price,
              products (name)
            `)
            .eq('order_id', order.id);
          
          if (itemsError) {
            console.error(`Error fetching items for order ${order.id}:`, itemsError);
            return null;
          }

          const formattedItems: OrderItem[] = itemsData.map(item => ({
            id: item.id,
            product_id: item.product_id,
            product_name: item.products?.name || 'Unknown Product',
            quantity: item.quantity,
            price: Number(item.price)
          }));

          const fullAddress = order.users ? [
            order.users.address,
            order.users.city,
            order.users.state,
            order.users.postal_code,
            order.users.country
          ].filter(Boolean).join(', ') : 'No address provided';

          return {
            id: order.id,
            customer_name: order.users ? 
              `${order.users.first_name || ''} ${order.users.last_name || ''}`.trim() || 'Unknown Customer' : 
              'Unknown Customer',
            customer_email: order.users?.email || 'No email',
            date: new Date(order.created_at).toLocaleDateString(),
            status: order.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
            items: formattedItems,
            total: Number(order.total),
            address: fullAddress,
            payment_method: 'Credit Card' // Default since we don't track this yet
          };
        })
      );
      
      // Filter out any null values from failed item fetches
      const validOrders = ordersWithItems.filter(order => order !== null) as Order[];
      setOrders(validOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const updateOrderStatus = async (orderId: number, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast({
        title: "Order status updated",
        description: `Order #${orderId} has been marked as ${newStatus}.`
      });
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update order status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <div className="bg-yellow-500 rounded-full w-3 h-3 mr-2" />;
      case 'processing':
        return <div className="bg-blue-500 rounded-full w-3 h-3 mr-2" />;
      case 'shipped':
        return <Truck size={16} className="text-purple-500 mr-2" />;
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500 mr-2" />;
      case 'cancelled':
        return <div className="bg-red-500 rounded-full w-3 h-3 mr-2" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Orders Management</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-gray-500">
                {filteredOrders.length} orders
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
              <span className="ml-2">Loading orders...</span>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.toString().padStart(5, '0')}</TableCell>
                        <TableCell>
                          <div>
                            <p>{order.customer_name}</p>
                            <p className="text-sm text-gray-500">{order.customer_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => viewOrderDetails(order)}
                          >
                            <Eye size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      
      {selectedOrder && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Order Details - #{selectedOrder.id}</span>
                <span className={`text-sm px-2 py-1 rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Customer</h4>
                  <p>{selectedOrder.customer_name}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Order Date</h4>
                  <p>{selectedOrder.date}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Shipping Address</h4>
                <p className="text-sm">{selectedOrder.address}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Payment Method</h4>
                <p className="text-sm">{selectedOrder.payment_method}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <div className="border rounded-md divide-y">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between p-3">
                      <div>
                        <p>{item.product_name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between font-medium">
                  <p>Total</p>
                  <p>${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                    disabled={isUpdating}
                  >
                    {isUpdating && selectedOrder.status !== 'pending' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Pending
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'processing' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    disabled={isUpdating}
                  >
                    <Package size={14} className="mr-1" />
                    {isUpdating && selectedOrder.status !== 'processing' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Processing
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'shipped' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    disabled={isUpdating}
                  >
                    <Truck size={14} className="mr-1" />
                    {isUpdating && selectedOrder.status !== 'shipped' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Shipped
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'delivered' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    disabled={isUpdating}
                  >
                    <CheckCircle size={14} className="mr-1" />
                    {isUpdating && selectedOrder.status !== 'delivered' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Delivered
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'cancelled' ? 'destructive' : 'outline'}
                    className={selectedOrder.status === 'cancelled' ? "" : "text-red-500 hover:text-white hover:bg-red-500"}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    disabled={isUpdating}
                  >
                    {isUpdating && selectedOrder.status !== 'cancelled' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Cancelled
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
