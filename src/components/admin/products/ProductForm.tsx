
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ProductType } from "@/types/product";

interface ProductFormProps {
  currentProduct: Partial<ProductType>;
  isEditing: boolean;
  isSaving: boolean;
  categories: string[];
  brands: string[];
  onSave: () => void;
  onCancel: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  const [isImageUploading, setIsImageUploading] = useState(false);

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={currentProduct.name}
          onChange={onChange}
          placeholder="Enter product name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={currentProduct.description}
          onChange={onChange as any}
          placeholder="Enter product description"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={currentProduct.price}
          onChange={onChange}
          placeholder="0.00"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Product Image</Label>
        <FileUpload 
          value={currentProduct.image || ''} 
          onChange={(url) => onSelectChange('image', url)}
          onUploading={setIsImageUploading}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={currentProduct.category} 
            onValueChange={(value) => onSelectChange('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Select 
            value={currentProduct.brand} 
            onValueChange={(value) => onSelectChange('brand', value)}
          >
            <SelectTrigger id="brand">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="inStock" 
          checked={currentProduct.inStock} 
          onCheckedChange={(checked) => onSelectChange('inStock', checked ? 'true' : 'false')}
        />
        <Label htmlFor="inStock">In Stock</Label>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button 
          onClick={onSave} 
          disabled={isSaving || isImageUploading} 
          type="button"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            isEditing ? 'Update Product' : 'Add Product'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
