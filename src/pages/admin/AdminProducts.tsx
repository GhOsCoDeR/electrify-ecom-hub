
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { ProductType } from "@/types/product";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

// Mock products data
const initialProducts: ProductType[] = [
  {
    id: 1,
    name: "Premium Electric Mixer",
    description: "High-quality electric mixer with multiple speed settings",
    price: 249.99,
    image: "/placeholder.svg",
    category: "kitchen-appliances",
    rating: 4.8,
    brand: "ElectriCo",
    inStock: true
  },
  {
    id: 2,
    name: "Smart LED Bulb",
    description: "Energy-efficient LED bulb with smart controls",
    price: 34.99,
    image: "/placeholder.svg",
    category: "lighting",
    rating: 4.5,
    brand: "BrightLife",
    inStock: true
  },
  {
    id: 3,
    name: "Wireless Power Strip",
    description: "Convenient power strip with wireless charging capabilities",
    price: 129.95,
    image: "/placeholder.svg",
    category: "home-appliances",
    rating: 4.2,
    brand: "PowerPlus",
    inStock: false
  }
];

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<ProductType>>({
    name: "",
    description: "",
    price: 0,
    image: "/placeholder.svg",
    category: "",
    rating: 0,
    brand: "",
    inStock: true
  });
  const [isEditing, setIsEditing] = useState(false);

  // Filter products based on search query
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
      image: "/placeholder.svg",
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

  const handleSaveProduct = () => {
    if (isEditing) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === currentProduct.id ? { ...currentProduct as ProductType } : product
      ));
      
      toast({
        title: "Product updated",
        description: `${currentProduct.name} has been updated successfully.`
      });
    } else {
      // Add new product
      const newProduct = {
        ...currentProduct,
        id: Math.max(...products.map(p => p.id)) + 1
      } as ProductType;
      
      setProducts([...products, newProduct]);
      
      toast({
        title: "Product added",
        description: `${newProduct.name} has been added successfully.`
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully."
    });
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
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Rating</TableHead>
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
                      <TableCell>{product.rating}</TableCell>
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
                <Input
                  id="category"
                  name="category"
                  value={currentProduct.category}
                  onChange={handleInputChange}
                  placeholder="e.g. kitchen-appliances"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={currentProduct.brand}
                  onChange={handleInputChange}
                  placeholder="e.g. ElectriCo"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={currentProduct.rating}
                  onChange={handleInputChange}
                  placeholder="e.g. 4.5"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={currentProduct.image}
                onChange={handleInputChange}
                placeholder="URL to product image"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProduct}>{isEditing ? "Update Product" : "Add Product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
