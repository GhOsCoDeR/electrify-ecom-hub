import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { ProductType } from "@/types/product";
import { Pencil, Trash2, Plus, Search, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useProductMetadata } from "@/hooks/useProductMetadata";

const AdminProducts = () => {
  const { toast } = useToast();
  const { categories, brands, isLoading: isMetadataLoading } = useProductMetadata();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<ProductType>>({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    rating: 0,
    brand: "",
    inStock: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

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
        image: item.image || "/placeholder.svg",
        category: item.category || "",
        rating: 0, // Default rating since it's not in the database
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
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddDialog = () => {
    setCurrentProduct({
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "",
      rating: 0,
      brand: "",
      inStock: true
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: ProductType) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "price" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProduct = async () => {
    if (!currentProduct.name || !currentProduct.price) {
      toast({
        title: "Validation Error",
        description: "Product name and price are required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare the data for Supabase
      const productData = {
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        image: currentProduct.image,
        category: currentProduct.category,
        brand: currentProduct.brand,
        in_stock: currentProduct.inStock
      };
      
      let result;
      
      if (isEditing && currentProduct.id) {
        // Update existing product
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', currentProduct.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        
        toast({
          title: "Product updated",
          description: `${currentProduct.name} has been updated successfully.`
        });
        
        // Update the products array
        setProducts(products.map(product => 
          product.id === currentProduct.id ? {
            ...product,
            ...productData,
            price: Number(productData.price)
          } : product
        ));
      } else {
        // Insert new product
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        
        toast({
          title: "Product added",
          description: `${currentProduct.name} has been added successfully.`
        });
        
        // Add the new product to the products array
        const newProduct: ProductType = {
          id: result.id,
          name: result.name,
          description: result.description || "",
          price: Number(result.price),
          image: result.image || "/placeholder.svg",
          category: result.category || "",
          rating: 0,
          brand: result.brand || "",
          inStock: result.in_stock === true
        };
        
        setProducts([...products, newProduct]);
      }
      
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the products array
      setProducts(products.filter(product => product.id !== id));
      
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully."
      });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Products Management</h1>
          
          <Button onClick={openAddDialog} className="flex items-center">
            <Plus size={16} className="mr-2" />
            Add Product
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="text-sm text-gray-500">
              {filteredProducts.length} products
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openEditDialog(product)}
                            className="mr-2"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-500"
                            disabled={isDeleting}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        No products found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the product details below." : "Fill in the product details below to add a new product."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                onChange={handleInputChange}
                placeholder="Brief description of the product"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={currentProduct.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
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
                  onValueChange={(value) => handleSelectChange("brand", value)}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveProduct}
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
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
