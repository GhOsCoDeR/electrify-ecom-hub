
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const subtotal = calculateSubtotal();
  const shipping = 15.00;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <WebsiteLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-electric-darkgray mb-8">Your Cart</h1>
        
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4">
                  <div className="col-span-6 font-medium">Product</div>
                  <div className="col-span-2 font-medium text-center">Price</div>
                  <div className="col-span-2 font-medium text-center">Quantity</div>
                  <div className="col-span-2 font-medium text-center">Total</div>
                </div>
                
                {cartItems.map(item => (
                  <div key={item.id} className="border-b border-gray-200 last:border-b-0">
                    <div className="grid grid-cols-1 md:grid-cols-12 p-4 items-center">
                      {/* Product Info - Mobile & Desktop */}
                      <div className="col-span-6 flex items-center mb-4 md:mb-0">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4 rounded bg-gray-100" />
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 p-0 h-auto mt-1 md:hidden"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 size={16} className="mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="col-span-2 text-center">
                        <div className="md:hidden inline-block mr-2 font-medium">Price:</div>
                        ${item.price.toFixed(2)}
                      </div>
                      
                      {/* Quantity */}
                      <div className="col-span-2 flex items-center justify-center my-4 md:my-0">
                        <div className="md:hidden inline-block mr-2 font-medium">Quantity:</div>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-electric-blue hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-electric-blue hover:bg-gray-100"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total & Remove Button */}
                      <div className="col-span-2 flex items-center justify-between">
                        <div>
                          <div className="md:hidden inline-block mr-2 font-medium">Total:</div>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hidden md:flex items-center"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-8">
                <Link to="/shop">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full mt-6 bg-electric-blue text-white hover:bg-blue-700"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </WebsiteLayout>
  );
};

export default CartPage;
