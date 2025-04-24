import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { ProductType } from "@/types/product";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useProductMetadata } from "@/hooks/useProductMetadata";
import ProductForm from "@/components/admin/products/ProductForm";
import ProductsTable from "@/components/admin/products/ProductsTable";
import ProductSearch from "@/components/admin/products/ProductSearch";

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
      
      const transformedProducts: ProductType[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: Number(item.price),
        image: item.image || "/placeholder.svg",
        category: item.category || "",
        rating: 0,
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
        
        setProducts(products.map(product => 
          product.id === currentProduct.id ? {
            ...product,
            ...productData,
            price: Number(productData.price)
          } : product
        ));
      } else {
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

  if (isLoading || isMetadataLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
          <span className="ml-2">Loading products...</span>
        </div>
      </AdminLayout>
    );
  }

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
          <ProductSearch 
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            totalProducts={filteredProducts.length}
          />
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : (
            <ProductsTable
              products={filteredProducts}
              isDeleting={isDeleting}
              onEdit={openEditDialog}
              onDelete={handleDeleteProduct}
            />
          )}
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the product details below." : "Fill in the product details below to add a new product."}
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm
            currentProduct={currentProduct}
            isEditing={isEditing}
            isSaving={isSaving}
            categories={categories.map(c => c.name)}
            brands={brands.map(b => b.name)}
            onSave={handleSaveProduct}
            onCancel={() => setIsDialogOpen(false)}
            onChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
