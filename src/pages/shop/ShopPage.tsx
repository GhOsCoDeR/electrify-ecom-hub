
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingCart, 
  ArrowUpDown, 
  Grid3X3, 
  List
} from "lucide-react";

import ShopLayout from "@/components/layout/ShopLayout";
import ProductCard from "@/components/shop/ProductCard";
import { ProductType } from "@/types/product";

// Sample product data (in a real app, this would come from an API)
const sampleProducts: ProductType[] = [
  {
    id: 1,
    name: "Smart LED Bulb",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?q=80&w=880&auto=format&fit=crop",
    category: "lighting",
    rating: 4.5,
    brand: "brightlife",
    inStock: true,
    description: "Energy-efficient smart LED bulb with adjustable brightness and color temperature."
  },
  {
    id: 2,
    name: "Electric Coffee Maker",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1570942872213-1242e212d760?q=80&w=1374&auto=format&fit=crop",
    category: "kitchen-appliances",
    rating: 4.2,
    brand: "kitchenmate",
    inStock: true,
    description: "Programmable coffee maker with 12-cup capacity and auto shut-off feature."
  },
  {
    id: 3,
    name: "Wireless Vacuum Cleaner",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=880&auto=format&fit=crop",
    category: "home-appliances",
    rating: 4.8,
    brand: "powerplus",
    inStock: true,
    description: "Cordless vacuum with powerful suction and up to 40 minutes of runtime."
  },
  {
    id: 4,
    name: "Smart Home Hub",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1470&auto=format&fit=crop",
    category: "smart-devices",
    rating: 4.7,
    brand: "smartech",
    inStock: true,
    description: "Central hub for controlling all your smart home devices in one place."
  },
  {
    id: 5,
    name: "Electric Kettle",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1594495894542-a46cc73e081a?q=80&w=871&auto=format&fit=crop",
    category: "kitchen-appliances",
    rating: 4.4,
    brand: "kitchenmate",
    inStock: true,
    description: "Fast-boiling electric kettle with temperature control and keep-warm function."
  },
  {
    id: 6,
    name: "Smart Thermostat",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1567596996303-0f3545e0541e?q=80&w=1374&auto=format&fit=crop",
    category: "smart-devices",
    rating: 4.6,
    brand: "smartech",
    inStock: true,
    description: "Wi-Fi enabled thermostat that learns your schedule and preferences."
  },
  {
    id: 7,
    name: "Ceiling Fan with Light",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1633883504314-3fb84b8a9228?q=80&w=1470&auto=format&fit=crop",
    category: "lighting",
    rating: 4.3,
    brand: "brightlife",
    inStock: false,
    description: "Modern ceiling fan with integrated LED light and remote control."
  },
  {
    id: 8,
    name: "Cordless Power Drill",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1470&auto=format&fit=crop",
    category: "tools",
    rating: 4.9,
    brand: "powerplus",
    inStock: true,
    description: "20V lithium-ion cordless drill with variable speed and LED work light."
  },
];

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"default" | "price-low" | "price-high" | "name">("default");
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(sampleProducts);
  
  // Filter products based on URL parameters and search term
  useEffect(() => {
    const categoryFilter = searchParams.get("category");
    
    let results = [...sampleProducts];
    
    // Apply category filter if present
    if (categoryFilter) {
      results = results.filter(product => product.category === categoryFilter);
    }
    
    // Apply search filter if present
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(lowercasedSearch) || 
        product.description.toLowerCase().includes(lowercasedSearch) ||
        product.category.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Apply sorting
    switch (sortOrder) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "name":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Default sorting (featured or bestselling) would typically be predetermined
        break;
    }
    
    setFilteredProducts(results);
  }, [searchParams, searchTerm, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The effect will handle filtering
  };

  return (
    <ShopLayout>
      {/* Shop Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shop Our Products</h1>
        <p className="text-gray-600">
          Browse our selection of high-quality electrical appliances and accessories.
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" className="btn-electric-primary">
            Search
          </Button>
        </form>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} products
          </div>
          
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-1 mr-2">
              <Button
                variant="ghost"
                size="icon"
                className={viewMode === "grid" ? "bg-electric-lightgray" : ""}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={viewMode === "list" ? "bg-electric-lightgray" : ""}
                onClick={() => setViewMode("list")}
              >
                <List size={18} />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-gray-500" />
              <select
                className="text-sm border rounded-md p-1"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-6"
        }>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ))}
        </div>
      )}
    </ShopLayout>
  );
};

export default ShopPage;
