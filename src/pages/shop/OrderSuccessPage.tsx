
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react"; // Corrected import for useEffect
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const OrderSuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // If no order data, redirect to home
  if (!state?.orderNumber) {
    navigate('/');
    return null;
  }

  // Clear cart on successful order
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <WebsiteLayout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-electric-darkgray mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl mb-2">Thank you for your purchase</p>
          <p className="text-gray-600 mb-8">
            Order #{state.orderNumber}
          </p>
          
          <p className="text-gray-600 mb-8">
            We'll send you a confirmation email with your order details and tracking information.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
            <Link to="/account">
              <Button>View Order Status</Button>
            </Link>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default OrderSuccessPage;
