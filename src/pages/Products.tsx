
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Package, Grid3X3, Table as TableIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  vendor: string;
  productName: string;
  enabled: boolean;
  customersCount: number;
}

const mockProducts: Product[] = [
  {
    id: 1,
    vendor: "Fortinet",
    productName: "FortiGate",
    enabled: true,
    customersCount: 5,
  },
  {
    id: 2,
    vendor: "Microsoft",
    productName: "Windows Server",
    enabled: true,
    customersCount: 8,
  },
  {
    id: 3,
    vendor: "Cisco",
    productName: "ASA Firewall",
    enabled: false,
    customersCount: 2,
  },
  {
    id: 4,
    vendor: "Apache",
    productName: "HTTP Server",
    enabled: true,
    customersCount: 12,
  },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const { toast } = useToast();

  const [newProduct, setNewProduct] = useState({
    vendor: "",
    productName: "",
  });

  const handleToggleEnabled = (id: number) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, enabled: !product.enabled }
        : product
    ));
    toast({
      title: "Product Updated",
      description: "Monitoring status has been updated.",
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.vendor || !newProduct.productName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const product: Product = {
      id: nextId,
      vendor: newProduct.vendor,
      productName: newProduct.productName,
      enabled: true,
      customersCount: 0,
    };

    setProducts([...products, product]);
    setNewProduct({ vendor: "", productName: "" });
    setIsAddDialogOpen(false);
    toast({
      title: "Product Added",
      description: "New product has been added successfully.",
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    setProducts(products.map(product => 
      product.id === editingProduct.id ? editingProduct : product
    ));
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    toast({
      title: "Product Updated",
      description: "Product information has been updated successfully.",
    });
  };

  const renderCardView = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-500" />
                <Badge variant={product.enabled ? "default" : "secondary"}>
                  {product.enabled ? "Active" : "Disabled"}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <CardTitle className="text-lg">{product.productName}</CardTitle>
                <p className="text-sm text-gray-600">by {product.vendor}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{product.customersCount} customers using</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Label htmlFor={`product-toggle-${product.id}`} className="text-sm font-medium">
                  Monitor for CVEs
                </Label>
                <Switch
                  id={`product-toggle-${product.id}`}
                  checked={product.enabled}
                  onCheckedChange={() => handleToggleEnabled(product.id)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Customers</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Monitor</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.productName}</TableCell>
              <TableCell>{product.vendor}</TableCell>
              <TableCell>{product.customersCount} customers</TableCell>
              <TableCell>
                <Badge variant={product.enabled ? "default" : "secondary"}>
                  {product.enabled ? "Active" : "Disabled"}
                </Badge>
              </TableCell>
              <TableCell>
                <Switch
                  checked={product.enabled}
                  onCheckedChange={() => handleToggleEnabled(product.id)}
                />
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage products to monitor for vulnerabilities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vendor">Vendor *</Label>
                  <Input
                    id="vendor"
                    value={newProduct.vendor}
                    onChange={(e) => setNewProduct({...newProduct, vendor: e.target.value})}
                    placeholder="e.g., Fortinet, Microsoft, Cisco"
                  />
                </div>
                <div>
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
                    placeholder="e.g., FortiGate, Windows Server"
                  />
                </div>
                <Button onClick={handleAddProduct} className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === 'cards' ? renderCardView() : renderTableView()}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editVendor">Vendor *</Label>
                <Input
                  id="editVendor"
                  value={editingProduct.vendor}
                  onChange={(e) => setEditingProduct({...editingProduct, vendor: e.target.value})}
                  placeholder="e.g., Fortinet, Microsoft, Cisco"
                />
              </div>
              <div>
                <Label htmlFor="editProductName">Product Name *</Label>
                <Input
                  id="editProductName"
                  value={editingProduct.productName}
                  onChange={(e) => setEditingProduct({...editingProduct, productName: e.target.value})}
                  placeholder="e.g., FortiGate, Windows Server"
                />
              </div>
              <Button onClick={handleUpdateProduct} className="w-full bg-blue-600 hover:bg-blue-700">
                Update Product
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
