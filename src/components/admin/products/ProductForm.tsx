
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { ProductType } from "@/types/product";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
  currentProduct: Partial<ProductType>;
  isEditing: boolean;
  isSaving: boolean;
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[];
  onSave: () => void;
  onCancel: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const ProductForm = ({
  currentProduct,
  isEditing,
  isSaving,
  categories,
  brands,
  onSave,
  onCancel,
  onChange,
  onSelectChange
}: ProductFormProps) => {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={currentProduct.name}
              onChange={onChange}
              placeholder="e.g. Premium Electric Mixer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={currentProduct.price}
              onChange={onChange}
              placeholder="e.g. 249.99"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={currentProduct.description}
            onChange={onChange}
            placeholder="Brief description of the product"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={currentProduct.category}
              onValueChange={(value) => onSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select
              value={currentProduct.brand}
              onValueChange={(value) => onSelectChange("brand", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            id="inStock"
            name="inStock"
            type="checkbox"
            checked={currentProduct.inStock}
            onChange={onChange}
            className="w-4 h-4"
          />
          <Label htmlFor="inStock">In Stock</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Product Image URL</Label>
          <Input
            id="image"
            name="image"
            value={currentProduct.image}
            onChange={onChange}
            placeholder="Enter image URL"
          />
          {currentProduct.image && (
            <div className="mt-2 w-20 h-20 rounded border overflow-hidden">
              <img 
                src={currentProduct.image} 
                alt="Product preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={onSave}
          disabled={isSaving || !currentProduct.name || !currentProduct.price}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            isEditing ? "Update Product" : "Add Product"
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default ProductForm;
