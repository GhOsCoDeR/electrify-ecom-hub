import { useParams, Link } from "react-router-dom";
import ShopLayout from "@/components/layout/ShopLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { getProductById } from "@/lib/database";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  in_stock: boolean;
  rating?: number;
  product_specifications?: Array<{
    id: number;
    name: string;
    value: string;
  }>;
};

const ProductPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productData = await getProductById(Number(id));
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image || '/placeholder.svg'
    };
    
    addToCart(cartItem);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <ShopLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
        </div>
      </ShopLayout>
    );
  }

  if (error || !product) {
    return (
      <ShopLayout>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="mb-4">{error || 'Product not found'}</p>
            <Link to="/shop" className="text-electric-blue hover:underline">
              Return to Shop
            </Link>
          </div>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="bg-white rounded-lg shadow-md">
        <div className="mb-4 p-4">
          <Link to="/shop" className="flex items-center text-electric-blue hover:underline">
            <ArrowLeft size={16} className="mr-1" />
            Back to Shop
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg flex items-center justify-center p-8">
            <img 
              src={product.image || '/placeholder.svg'} 
              alt={product.name}
              className="max-h-80 object-contain"
            />
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-electric-darkgray mb-2">{product.name}</h1>
            
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} 
                      className={i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-gray-600">{product.rating} ({Math.floor((product.rating || 0) * 10)} reviews)</span>
              </div>
            )}
            
            <div className="text-2xl font-bold text-electric-blue mb-4">${product.price}</div>
            
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <p className="font-semibold mb-2">Brand: <span className="font-normal">{product.brand}</span></p>
              <p className="font-semibold mb-2">
                Availability: 
                <span className={`font-normal ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.in_stock ? ' In Stock' : ' Out of Stock'}
                </span>
              </p>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="border border-gray-300 rounded-md flex items-center mr-4">
                <button 
                  onClick={decrementQuantity}
                  className="px-3 py-2 text-electric-blue hover:bg-gray-100 border-r border-gray-300"
                >
                  -
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="px-3 py-2 text-electric-blue hover:bg-gray-100 border-l border-gray-300"
                >
                  +
                </button>
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                className="bg-electric-blue text-white hover:bg-blue-700 flex items-center"
                disabled={!product.in_stock}
              >
                <ShoppingCart size={16} className="mr-2" />
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Specifications */}
        {product.product_specifications && product.product_specifications.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.product_specifications.map((spec) => (
                <div key={spec.id} className="flex">
                  <span className="font-medium w-1/3">{spec.name}:</span>
                  <span className="text-gray-600">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  );
};

export default ProductPage;
