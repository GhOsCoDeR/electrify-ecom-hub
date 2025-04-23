
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { Search, Eye, Package, Truck, CheckCircle } from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  address: string;
  paymentMethod: string;
}

// Mock orders data
const initialOrders: Order[] = [
  {
    id: "ORD-2023-001",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    date: "2023-04-15",
    status: "delivered",
    items: [
      { id: 1, name: "Premium Electric Mixer", quantity: 1, price: 249.99 },
      { id: 2, name: "Smart LED Bulb", quantity: 2, price: 34.99 }
    ],
    total: 319.97,
    address: "123 Main St, New York, NY 10001",
    paymentMethod: "Credit Card"
  },
  {
    id: "ORD-2023-002",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    date: "2023-04-18",
    status: "processing",
    items: [
      { id: 3, name: "Wireless Power Strip", quantity: 1, price: 129.95 }
    ],
    total: 129.95,
    address: "456 Elm St, Boston, MA 02108",
    paymentMethod: "PayPal"
  },
  {
    id: "ORD-2023-003",
    customerName: "Robert Johnson",
    customerEmail: "robert.johnson@example.com",
    date: "2023-04-20",
    status: "shipped",
    items: [
      { id: 2, name: "Smart LED Bulb", quantity: 5, price: 34.99 },
      { id: 4, name: "Motion Sensor", quantity: 2, price: 29.99 }
    ],
    total: 234.93,
    address: "789 Oak St, Chicago, IL 60007",
    paymentMethod: "Credit Card"
  }
];

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders based on search query and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const updateOrderStatus = (orderId: string, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    toast({
      title: "Order status updated",
      description: `Order ${orderId} has been marked as ${newStatus}.`
    });
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
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
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p>{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
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
        </div>
      </div>
      
      {selectedOrder && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Order Details - {selectedOrder.id}</span>
                <span className={`text-sm px-2 py-1 rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Customer</h4>
                  <p>{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
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
                <p className="text-sm">{selectedOrder.paymentMethod}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <div className="border rounded-md divide-y">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between p-3">
                      <div>
                        <p>{item.name}</p>
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
                  >
                    Pending
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'processing' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                  >
                    <Package size={14} className="mr-1" />
                    Processing
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'shipped' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                  >
                    <Truck size={14} className="mr-1" />
                    Shipped
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'delivered' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                  >
                    <CheckCircle size={14} className="mr-1" />
                    Delivered
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'cancelled' ? 'destructive' : 'outline'}
                    className={selectedOrder.status === 'cancelled' ? "" : "text-red-500 hover:text-white hover:bg-red-500"}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                  >
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
