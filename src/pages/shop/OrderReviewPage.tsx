
import { useLocation, useNavigate } from "react-router-dom";
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const OrderReviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems } = useCart();
  
  // If no order data, redirect back to checkout
  if (!state?.orderData || !state?.formData) {
    navigate('/checkout');
    return null;
  }

  const { orderData, formData } = state;

  // Verify cart hasn't changed
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleConfirmOrder = async () => {
    try {
      // Simulate order confirmation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to success page with order details
      navigate('/order-success', {
        state: {
          orderNumber: Math.floor(100000 + Math.random() * 900000),
          orderData,
          formData
        }
      });
    } catch (error) {
      toast({
        title: "Error confirming order",
        description: "There was a problem confirming your order. Please try again.",
        variant: "destructive",
      });
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
              <p className="capitalize">{formData.paymentMethod.replace(/-/g, ' ')}</p>
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
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${orderData.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${orderData.tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button onClick={handleConfirmOrder} className="w-full bg-electric-blue text-white hover:bg-blue-700">
                Confirm Order
              </Button>
              <Button variant="outline" onClick={() => navigate('/checkout')} className="w-full">
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
