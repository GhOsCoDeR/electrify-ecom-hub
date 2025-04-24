import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

// Types for database items
interface CategoryType {
  id: string;
  name: string;
}

interface BrandType {
  id: string;
  name: string;
}

const ShopSidebar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for categories and brands
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [initialPriceRange, setInitialPriceRange] = useState([0, 1000]);
  
  // Get current category from URL
  const currentCategory = searchParams.get('category') || '';

  // Fetch categories and brands from database
  useEffect(() => {
    const fetchFilters = async () => {
      setIsLoading(true);
      try {
        // Fetch unique product categories from the products table
        const { data: categoryData, error: categoryError } = await supabase
          .from('products')
          .select('category')
          .not('category', 'is', null);
        
        if (categoryError) throw categoryError;
        
        // Fetch unique brands from the products table
        const { data: brandData, error: brandError } = await supabase
          .from('products')
          .select('brand')
          .not('brand', 'is', null);
        
        if (brandError) throw brandError;
        
        // Extract unique categories and format them
        const uniqueCategories = Array.from(new Set(categoryData.map(item => item.category)))
          .filter(Boolean)
          .map(category => ({
            id: category.toLowerCase().replace(/\s+/g, '-'),
            name: category
          }));
        
        // Extract unique brands and format them
        const uniqueBrands = Array.from(new Set(brandData.map(item => item.brand)))
          .filter(Boolean)
          .map(brand => ({
            id: brand.toLowerCase().replace(/\s+/g, '-'),
            name: brand
          }));
        
        setCategories(uniqueCategories);
        setBrands(uniqueBrands);
        
        // Get price range
        const { data: priceData, error: priceError } = await supabase
          .from('products')
          .select('price');
        
        if (priceError) throw priceError;
        
        if (priceData.length > 0) {
          const prices = priceData.map(p => Number(p.price)).filter(p => !isNaN(p));
          if (prices.length > 0) {
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));
            setInitialPriceRange([minPrice, maxPrice]);
            setPriceRange([minPrice, maxPrice]);
          }
        }
        
        // Initialize filter states from URL
        const brandParams = searchParams.get('brands');
        if (brandParams) {
          setSelectedBrands(brandParams.split(','));
        }
        
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice && maxPrice) {
          setPriceRange([Number(minPrice), Number(maxPrice)]);
        }
        
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFilters();
  }, [searchParams]);
  
  // Handle brand selection
  const handleBrandChange = (brandId: string, checked: boolean) => {
    setSelectedBrands(prev => {
      if (checked) {
        return [...prev, brandId];
      } else {
        return prev.filter(id => id !== brandId);
      }
    });
  };
  
  // Apply filters
  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    
    // Apply brand filter
    if (selectedBrands.length > 0) {
      newParams.set('brands', selectedBrands.join(','));
    } else {
      newParams.delete('brands');
    }
    
    // Apply price filter
    if (priceRange[0] !== initialPriceRange[0]) {
      newParams.set('minPrice', priceRange[0].toString());
    } else {
      newParams.delete('minPrice');
    }
    
    if (priceRange[1] !== initialPriceRange[1]) {
      newParams.set('maxPrice', priceRange[1].toString());
    } else {
      newParams.delete('maxPrice');
    }
    
    setSearchParams(newParams);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedBrands([]);
    setPriceRange(initialPriceRange);
    
    const newParams = new URLSearchParams();
    if (currentCategory) {
      newParams.set('category', currentCategory);
    }
    setSearchParams(newParams);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5 flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
        <span className="ml-2">Loading filters...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <ul className="space-y-2">
          <li>
            <Link 
              to="/shop"
              className={`text-electric-darkgray hover:text-electric-blue transition-colors duration-300 ${
                !currentCategory ? 'font-bold text-electric-blue' : ''
              }`}
            >
              All Categories
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link 
                to={`/shop?category=${category.id}`}
                className={`text-electric-darkgray hover:text-electric-blue transition-colors duration-300 ${
                  currentCategory === category.id ? 'font-bold text-electric-blue' : ''
                }`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`brand-${brand.id}`} 
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={(checked) => handleBrandChange(brand.id, checked === true)}
              />
              <Label htmlFor={`brand-${brand.id}`} className="text-sm font-normal cursor-pointer">
                {brand.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          max={initialPriceRange[1]}
          min={initialPriceRange[0]}
          step={5}
          onValueChange={setPriceRange}
        />
        <div className="flex justify-between mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <Button onClick={applyFilters} className="w-full bg-electric-blue hover:bg-blue-700">
          Apply Filters
        </Button>
        <Button onClick={resetFilters} variant="outline" className="w-full">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default ShopSidebar;
