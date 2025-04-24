import { useLocation, useNavigate } from "react-router-dom";
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const OrderReviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!state?.orderData || !state?.formData) {
    navigate('/checkout');
    return null;
  }

  const { orderData, formData } = state;

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleConfirmOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to place an order.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Create the order in the database
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            status: 'pending',
            total: orderData.total,
          }
        ])
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // 2. Create the order items
      const orderItems = cartItems.map(item => ({
        order_id: newOrder.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // 3. Generate an order number
      const orderNumber = Math.floor(100000 + Math.random() * 900000);
      
      // 4. Clear the cart after successful order
      clearCart();
      
      // 5. Navigate to success page
      navigate('/order-success', {
        state: {
          orderNumber,
          orderId: newOrder.id,
          orderData,
          formData
        }
      });
      
    } catch (error) {
      console.error("Error saving order:", error);
      toast({
        title: "Error confirming order",
        description: "There was a problem saving your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPaymentDetails = () => {
    const { paymentMethod } = formData;
    
    switch (paymentMethod) {
      case 'credit-card':
        return (
          <>
            <p><span className="font-medium">Card Number:</span> **** **** **** {formData.cardNumber?.slice(-4)}</p>
            <p><span className="font-medium">Expiry:</span> {formData.cardExpiry}</p>
          </>
        );
      case 'mtn-money':
        return (
          <>
            <p><span className="font-medium">Mobile Money Number:</span> {formData.mobileNumber}</p>
            <p><span className="font-medium">Network:</span> MTN</p>
          </>
        );
      case 'vodafone-cash':
        return (
          <>
            <p><span className="font-medium">Mobile Money Number:</span> {formData.mobileNumber}</p>
            <p><span className="font-medium">Network:</span> Vodafone</p>
          </>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch(method) {
      case 'credit-card': return 'Credit Card';
      case 'mtn-money': return 'MTN Mobile Money';
      case 'vodafone-cash': return 'Vodafone Cash';
      case 'bank-transfer': return 'Bank Transfer';
      default: return method.replace(/-/g, ' ');
    }
  };

  return (
    <WebsiteLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-electric-darkgray mb-8">Review Your Order</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
                <p><span className="font-medium">Email:</span> {formData.email}</p>
                <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                <p><span className="font-medium">Address:</span> {formData.address}</p>
                <p><span className="font-medium">City:</span> {formData.city}</p>
                <p><span className="font-medium">State:</span> {formData.state}</p>
                <p><span className="font-medium">ZIP Code:</span> {formData.zipCode}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <p className="mb-4">{getPaymentMethodDisplay(formData.paymentMethod)}</p>
              {renderPaymentDetails()}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              {orderData.items.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p>₵{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₵{orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₵{orderData.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₵{orderData.tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₵{orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleConfirmOrder} 
                className="w-full bg-electric-blue text-white hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Order"
                )}
              </Button>
              <Button variant="outline" onClick={() => navigate('/checkout')} className="w-full" disabled={isSubmitting}>
                Back to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default OrderReviewPage;
