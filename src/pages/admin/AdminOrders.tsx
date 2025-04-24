import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { Search, Eye, Package, Truck, CheckCircle, Loader2, RefreshCw } from "lucide-react";
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
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [demoMode, setDemoMode] = useState(() => {
    // Use window.localStorage to avoid SSR issues
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('demo-mode') : null;
    return saved === 'true';
  });

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (isRetry = false) => {
    setIsLoading(true);
    
    // If this is a retry, let the user know
    if (isRetry) {
      toast({
        title: "Retrying connection",
        description: "Attempting to reconnect to the database..."
      });
    }
    
    try {
      console.log("Fetching orders from database...");
      
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
      
      console.log(`Retrieved ${data?.length || 0} orders from database`);
      
      // Reset error state on successful fetch
      if (fetchError) setFetchError(false);
      
      if (!data || data.length === 0) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      // Get order items for each order
      const ordersWithItems = await Promise.all(
        data.map(async (order) => {
          try {
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
              // Instead of returning null, return the order without items
              return {
                id: order.id,
                customer_name: order.users ? 
                  `${order.users.first_name || ''} ${order.users.last_name || ''}`.trim() || 'Unknown Customer' : 
                  'Unknown Customer',
                customer_email: order.users?.email || 'No email',
                date: new Date(order.created_at).toLocaleDateString(),
                status: order.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
                items: [], // Empty items array if we can't fetch them
                total: Number(order.total),
                address: order.users ? getFullAddress(order.users) : 'No address provided',
                payment_method: 'Credit Card' // Default since we don't track this yet
              };
            }

            if (!itemsData || itemsData.length === 0) {
              console.warn(`No items found for order ${order.id}`);
            }

            const formattedItems: OrderItem[] = (itemsData || []).map(item => ({
              id: item.id,
              product_id: item.product_id,
              product_name: item.products?.name || 'Unknown Product',
              quantity: item.quantity,
              price: Number(item.price)
            }));

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
              address: order.users ? getFullAddress(order.users) : 'No address provided',
              payment_method: 'Credit Card' // Default since we don't track this yet
            };
          } catch (e) {
            console.error(`Error processing order ${order.id}:`, e);
            return null;
          }
        })
      );
      
      // Filter out any null values from failed item fetches
      const validOrders = ordersWithItems.filter(order => order !== null) as Order[];
      console.log(`Successfully processed ${validOrders.length} valid orders`);
      setOrders(validOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setFetchError(true);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add this helper function for formatting addresses
  const getFullAddress = (user: any) => {
    return [
      user.address,
      user.city,
      user.state,
      user.postal_code,
      user.country
    ].filter(Boolean).join(', ');
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

  // First add a method to check if we have proper permissions
  const checkPermissions = async () => {
    try {
      // Try a simple read operation to see if we have basic access
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .limit(1);
        
      if (error) {
        console.error("Permission check failed:", error);
        // If we get specific permission errors, we can inform the user
        if (error.message && (
          error.message.includes('permission denied') || 
          error.message.includes('not authorized') ||
          error.message.includes('RLS') ||
          error.message.includes('policy')
        )) {
          toast({
            title: "Permission Error",
            description: "You don't have permission to access orders. Please contact an administrator or check the database settings.",
            variant: "destructive"
          });
          return false;
        }
      }
      
      return true;
    } catch (e) {
      console.error("Error checking permissions:", e);
      return false;
    }
  };

  // Modify the updateOrderStatus function to handle cases where database updates fail but we want the UI to update anyway
  const updateOrderStatus = async (orderId: number, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    setUpdatingStatus(newStatus);
    
    try {
      console.log(`Attempting to update order ${orderId} to status: ${newStatus}`);
      
      // Check if the order exists and get its current status
      const { data: orderCheck, error: checkError } = await supabase
        .from('orders')
        .select('id, status')
        .eq('id', orderId)
        .single();
      
      console.log("Order check result:", { orderCheck, checkError });
      
      if (checkError) {
        if (checkError.code === 'PGRST116') {
          console.error(`Order #${orderId} not found in database during pre-check`);
          toast({
            title: "Error",
            description: `Order #${orderId} could not be found in the database. Please refresh the page.`,
            variant: "destructive"
          });
          return;
        } else {
          console.error("Error checking order:", checkError);
          // Continue anyway since we might be able to update the UI
        }
      }
      
      if (orderCheck && orderCheck.status === newStatus) {
        console.log(`Order ${orderId} is already in ${newStatus} status. No update needed.`);
        toast({
          title: "Info",
          description: `Order is already marked as ${newStatus}.`
        });
        return;
      }
      
      // Try to update in the database first
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      
      let updateSucceeded = false;
      let updateError = null;
      
      // First attempt - using the .match approach
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .match({ id: orderId });
          
        if (!error) {
          updateSucceeded = true;
        } else {
          updateError = error;
          console.warn("First update attempt failed:", error);
        }
      } catch (e) {
        console.error("Exception in first update attempt:", e);
      }
      
      // Second attempt if first failed - using .eq approach
      if (!updateSucceeded) {
        try {
          const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);
            
          if (!error) {
            updateSucceeded = true;
          } else {
            updateError = error;
            console.warn("Second update attempt failed:", error);
          }
        } catch (e) {
          console.error("Exception in second update attempt:", e);
        }
      }
      
      // Verify the update if we think it succeeded
      if (updateSucceeded) {
        try {
          const { data: verifyData, error: verifyError } = await supabase
            .from('orders')
            .select('status')
            .eq('id', orderId)
            .single();
          
          if (verifyError) {
            console.warn("Verification query failed:", verifyError);
            // Continue anyway since the update might have worked
          } else if (verifyData.status !== newStatus) {
            console.warn(`Update didn't take effect. Current status: ${verifyData.status}, expected: ${newStatus}`);
            updateSucceeded = false;
          } else {
            console.log("Update verified successful!");
          }
        } catch (e) {
          console.error("Exception during verification:", e);
        }
      }
      
      // Special case: If we're in development or demo mode, update the UI even if database update failed
      // This allows for testing the UI without needing proper database permissions
      console.log("Demo mode status:", demoMode);
      const forceUIUpdate = process.env.NODE_ENV === 'development' || demoMode;
      
      if (updateSucceeded || forceUIUpdate) {
        // Success path - update the local state with the updated order
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        
        // Update the selected order if it's currently being viewed
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        
        if (updateSucceeded) {
          toast({
            title: "Order status updated",
            description: `Order #${orderId} has been marked as ${newStatus}.`
          });
        } else {
          // We're forcing a UI update but the database update failed
          toast({
            title: "UI Updated (Database Failed)",
            description: "The UI has been updated but the database update failed. This change will be lost on refresh.",
            variant: "destructive"
          });
          console.warn("Database update failed but UI was updated due to development/demo mode");
        }
      } else {
        // All update attempts failed
        let errorMessage = "Database permission error. ";
        
        if (updateError && updateError.message) {
          if (updateError.message.includes('permission denied') || 
              updateError.message.includes('not authorized') ||
              updateError.message.includes('RLS')) {
            errorMessage += "You don't have permission to update orders. ";
          }
        }
        
        toast({
          title: "Error",
          description: (
            <div>
              <p>{errorMessage}Please try again or contact an administrator.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-xs bg-white hover:bg-green-100 border-green-200"
                onClick={enableDemoMode}
              >
                Enable Demo Mode
              </Button>
            </div>
          ),
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error updating order status:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      
      toast({
        title: "Error",
        description: "Failed to update order status. Please check developer console for details.",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
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

  // Add this function to toggle demo mode
  const toggleDemoMode = () => {
    const newDemoMode = !demoMode;
    setDemoMode(newDemoMode);
    
    try {
      window.localStorage.setItem('demo-mode', newDemoMode.toString());
      console.log(`Demo mode ${newDemoMode ? 'enabled' : 'disabled'}`);
    } catch (e) {
      console.error("Could not save demo mode to localStorage:", e);
    }
    
    toast({
      title: newDemoMode ? "Demo Mode Activated" : "Demo Mode Deactivated",
      description: newDemoMode 
        ? "Changes will update the UI but not persist to the database" 
        : "Changes will only be applied if you have database permissions",
    });
  };

  // Create a specific function to enable demo mode from error messages
  const enableDemoMode = () => {
    setDemoMode(true);
    try {
      window.localStorage.setItem('demo-mode', 'true');
      console.log("Demo mode enabled from error handler");
    } catch (e) {
      console.error("Could not save demo mode to localStorage:", e);
    }
    
    toast({
      title: "Demo Mode Activated",
      description: "Changes will now update the UI even if database operations fail"
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <Button 
            onClick={() => fetchOrders(false)} 
            variant="outline" 
            disabled={isLoading}
            className="flex gap-2 items-center"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
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
          ) : fetchError ? (
            <div className="flex flex-col justify-center items-center py-12 space-y-4">
              <p className="text-red-500">There was an error loading your orders.</p>
              <Button onClick={() => fetchOrders(true)} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
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
                    disabled={updatingStatus !== null}
                  >
                    {updatingStatus === 'pending' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Pending
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'processing' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    disabled={updatingStatus !== null}
                  >
                    <Package size={14} className="mr-1" />
                    {updatingStatus === 'processing' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Processing
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'shipped' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    disabled={updatingStatus !== null}
                  >
                    <Truck size={14} className="mr-1" />
                    {updatingStatus === 'shipped' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Shipped
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'delivered' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    disabled={updatingStatus !== null}
                  >
                    <CheckCircle size={14} className="mr-1" />
                    {updatingStatus === 'delivered' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Delivered
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'cancelled' ? 'destructive' : 'outline'}
                    className={selectedOrder.status === 'cancelled' ? "" : "text-red-500 hover:text-white hover:bg-red-500"}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    disabled={updatingStatus !== null}
                  >
                    {updatingStatus === 'cancelled' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Cancelled
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {(fetchError || orders.length > 0 || demoMode || isViewDialogOpen) && (
        <div className="fixed bottom-4 right-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg max-w-md z-50">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-yellow-800">Having trouble with order updates?</h3>
            <Button 
              variant={demoMode ? "default" : "outline"} 
              size="sm" 
              className={`text-xs ml-2 ${demoMode ? "bg-green-600 hover:bg-green-700" : "bg-white hover:bg-yellow-100 border-yellow-200"}`}
              onClick={toggleDemoMode}
            >
              {demoMode ? "Demo Mode ON" : "Demo Mode OFF"}
            </Button>
          </div>
          <p className="text-xs mt-1 text-yellow-600">
            If you're experiencing issues updating orders:
          </p>
          <ul className="text-xs mt-1 space-y-1 list-disc list-inside text-yellow-600">
            <li>Check your database connection</li>
            <li>Verify Supabase permissions</li>
            <li>Make sure the correct Supabase URL and API key are configured</li>
            <li>Try refreshing the page</li>
          </ul>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-white hover:bg-yellow-100 border-yellow-200"
              onClick={() => fetchOrders(true)}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh Data
            </Button>
          </div>
          {demoMode && (
            <p className="text-xs mt-2 text-green-600 font-medium">
              Demo Mode is active. UI updates will appear to work even if database updates fail.
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
