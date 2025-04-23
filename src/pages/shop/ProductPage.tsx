
import { useParams } from "react-router-dom";
import ShopLayout from "@/components/layout/ShopLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  
  // Mock product data - in a real app, this would come from an API
  const product = {
    id: Number(id),
    name: "Premium Electric Mixer",
    description: "High-quality electric mixer with multiple speed settings and attachments. Perfect for all your kitchen needs. Energy-efficient design with a powerful motor that can handle even the toughest mixing tasks.",
    price: 249.99,
    image: "/placeholder.svg",
    category: "kitchen-appliances",
    rating: 4.8,
    brand: "ElectriCo",
    inStock: true,
    specifications: [
      { name: "Power", value: "800W" },
      { name: "Voltage", value: "220-240V" },
      { name: "Speed Settings", value: "10" },
      { name: "Warranty", value: "2 Years" },
      { name: "Weight", value: "5.2kg" }
    ]
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart`);
    // In a real app, this would update a cart state or call an API
  };

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
              src={product.image} 
              alt={product.name}
              className="max-h-80 object-contain"
            />
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-electric-darkgray mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                    className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-gray-600">{product.rating} ({Math.floor(product.rating * 10)} reviews)</span>
            </div>
            
            <div className="text-2xl font-bold text-electric-blue mb-4">${product.price}</div>
            
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <p className="font-semibold mb-2">Brand: <span className="font-normal">{product.brand}</span></p>
              <p className="font-semibold mb-2">
                Availability: 
                <span className={`font-normal ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? ' In Stock' : ' Out of Stock'}
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
              
              <Button onClick={addToCart} className="bg-electric-blue text-white hover:bg-blue-700 flex items-center">
                <ShoppingCart size={16} className="mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
        
        {/* Specifications */}
        <div className="border-t border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications.map((spec, index) => (
              <div key={index} className="flex">
                <span className="font-medium w-1/3">{spec.name}:</span>
                <span className="text-gray-600">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default ProductPage;
