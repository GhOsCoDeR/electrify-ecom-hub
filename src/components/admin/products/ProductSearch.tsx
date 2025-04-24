
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  searchQuery: string;
  onSearch: (value: string) => void;
  totalProducts: number;
}

const ProductSearch = ({ searchQuery, onSearch, totalProducts }: ProductSearchProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="text-sm text-gray-500">
        {totalProducts} products
      </div>
    </div>
  );
};

export default ProductSearch;
