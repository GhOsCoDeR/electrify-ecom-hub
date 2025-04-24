import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingCart, 
  ArrowUpDown, 
  Grid3X3, 
  List,
  Loader2
} from "lucide-react";

import ShopLayout from "@/components/layout/ShopLayout";
import ProductCard from "@/components/shop/ProductCard";
import { ProductType } from "@/types/product";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"default" | "price-low" | "price-high" | "name">("default");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Transform the data to match ProductType
        const transformedProducts: ProductType[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: Number(item.price),
          image: item.image || "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?q=80&w=880&auto=format&fit=crop",
          category: item.category || "",
          rating: 4.5, // Default rating since it's not in the database
          brand: item.brand || "",
          inStock: item.in_stock === true
        }));
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to fetch products. Please try again.",
          variant: "destructive"
        });
        // Set empty products array
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Filter products based on URL parameters and search term
  useEffect(() => {
    const categoryFilter = searchParams.get("category");
    const brandFilter = searchParams.get("brands");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    
    let results = [...products];
    
    // Apply category filter if present
    if (categoryFilter) {
      results = results.filter(product => 
        product.category.toLowerCase().replace(/\s+/g, '-') === categoryFilter
      );
    }
    
    // Apply brand filter if present
    if (brandFilter) {
      const brandIds = brandFilter.split(',');
      results = results.filter(product => 
        brandIds.includes(product.brand.toLowerCase().replace(/\s+/g, '-'))
      );
    }
    
    // Apply price filter if present
    if (minPrice) {
      results = results.filter(product => product.price >= Number(minPrice));
    }
    
    if (maxPrice) {
      results = results.filter(product => product.price <= Number(maxPrice));
    }
    
    // Apply search filter if present
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(lowercasedSearch) || 
        product.description.toLowerCase().includes(lowercasedSearch) ||
        (product.category && product.category.toLowerCase().includes(lowercasedSearch))
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
  }, [searchParams, searchTerm, sortOrder, products]);

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
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
          <span className="ml-2">Loading products...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
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
