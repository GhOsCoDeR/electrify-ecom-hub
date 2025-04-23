
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProductType } from "@/types/product";

interface ProductCardProps {
  product: ProductType;
  viewMode: "grid" | "list";
}

const ProductCard = ({ product, viewMode }: ProductCardProps) => {
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Grid view card
  if (viewMode === "grid") {
    return (
      <Link to={`/shop/product/${product.id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
          <div className="relative h-56 overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            />
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}
          </div>
          <CardContent className="p-4 flex-1 flex flex-col">
            <p className="text-sm text-electric-blue">{product.category.replace('-', ' ').toUpperCase()}</p>
            <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
            <div className="flex items-center mt-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
              <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
            </div>
            <div className="text-xl font-bold mt-auto">${product.price.toFixed(2)}</div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button 
                className="btn-electric-primary w-full" 
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={16} className="mr-1" /> Add
              </Button>
              <Button variant="outline" className="w-full">
                <Eye size={16} className="mr-1" /> Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // List view card
  return (
    <Link to={`/shop/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/4 h-56 md:h-auto overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            />
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}
          </div>
          <CardContent className="p-5 md:w-3/4 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-electric-blue">{product.category.replace('-', ' ').toUpperCase()}</p>
                <h3 className="text-xl font-semibold">{product.name}</h3>
              </div>
              <div className="text-xl font-bold">${product.price.toFixed(2)}</div>
            </div>
            
            <div className="flex items-center mt-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
              <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
            </div>
            
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="flex gap-3 mt-auto">
              <Button 
                className="btn-electric-primary" 
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={16} className="mr-1" /> Add to Cart
              </Button>
              <Button variant="outline">
                <Eye size={16} className="mr-1" /> View Details
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
