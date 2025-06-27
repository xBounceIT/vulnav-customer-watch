
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Mail, Building, Grid3X3, Table as TableIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: number;
  companyName: string;
  email: string;
  products: string[];
  enabled: boolean;
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    companyName: "TechCorp Inc",
    email: "security@techcorp.com",
    products: ["FortiGate", "Windows Server", "Apache"],
    enabled: true,
  },
  {
    id: 2,
    companyName: "SecureBank Ltd",
    email: "it@securebank.com", 
    products: ["Cisco ASA", "Oracle Database"],
    enabled: false,
  },
];

const availableProducts = [
  "FortiGate",
  "Windows Server", 
  "Apache",
  "Cisco ASA",
  "Oracle Database"
];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const { toast } = useToast();

  const [newCustomer, setNewCustomer] = useState({
    companyName: "",
    email: "",
    products: [] as string[],
  });

  const handleToggleEnabled = (id: number) => {
    setCustomers(customers.map(customer => 
      customer.id === id 
        ? { ...customer, enabled: !customer.enabled }
        : customer
    ));
    toast({
      title: "Customer Updated",
      description: "Monitoring status has been updated.",
    });
  };

  const handleAddCustomer = () => {
    if (!newCustomer.companyName || !newCustomer.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const nextId = customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const customer: Customer = {
      id: nextId,
      companyName: newCustomer.companyName,
      email: newCustomer.email,
      products: newCustomer.products,
      enabled: true,
    };

    setCustomers([...customers, customer]);
    setNewCustomer({ companyName: "", email: "", products: [] });
    setIsAddDialogOpen(false);
    toast({
      title: "Customer Added",
      description: "New customer has been added successfully.",
    });
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCustomer = () => {
    if (!editingCustomer) return;

    setCustomers(customers.map(customer => 
      customer.id === editingCustomer.id ? editingCustomer : customer
    ));
    setIsEditDialogOpen(false);
    setEditingCustomer(null);
    toast({
      title: "Customer Updated",
      description: "Customer information has been updated successfully.",
    });
  };

  const handleProductToggle = (product: string, isAdd: boolean) => {
    if (isAdd) {
      setNewCustomer(prev => ({
        ...prev,
        products: [...prev.products, product]
      }));
    } else {
      setNewCustomer(prev => ({
        ...prev,
        products: prev.products.filter(p => p !== product)
      }));
    }
  };

  const handleEditProductToggle = (product: string) => {
    if (!editingCustomer) return;
    
    const hasProduct = editingCustomer.products.includes(product);
    setEditingCustomer({
      ...editingCustomer,
      products: hasProduct 
        ? editingCustomer.products.filter(p => p !== product)
        : [...editingCustomer.products, product]
    });
  };

  const renderCardView = () => (
    <div className="grid gap-4">
      {customers.map((customer) => (
        <Card key={customer.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-lg">{customer.companyName}</CardTitle>
                <Badge variant={customer.enabled ? "default" : "secondary"}>
                  {customer.enabled ? "Active" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditCustomer(customer)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`toggle-${customer.id}`} className="text-sm">
                    Monitor
                  </Label>
                  <Switch
                    id={`toggle-${customer.id}`}
                    checked={customer.enabled}
                    onCheckedChange={() => handleToggleEnabled(customer.id)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {customer.email}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Associated Products:</p>
                <div className="flex flex-wrap gap-1">
                  {customer.products.map((product, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>
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
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Monitor</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.companyName}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {customer.products.map((product, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={customer.enabled ? "default" : "secondary"}>
                  {customer.enabled ? "Active" : "Disabled"}
                </Badge>
              </TableCell>
              <TableCell>
                <Switch
                  checked={customer.enabled}
                  onCheckedChange={() => handleToggleEnabled(customer.id)}
                />
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEditCustomer(customer)}>
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
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage customer accounts and monitoring settings</p>
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
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={newCustomer.companyName}
                    onChange={(e) => setNewCustomer({...newCustomer, companyName: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Contact Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    placeholder="security@company.com"
                  />
                </div>
                <div>
                  <Label>Associated Products</Label>
                  <Select onValueChange={(value) => handleProductToggle(value, true)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select products to associate" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.filter(p => !newCustomer.products.includes(p)).map((product) => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newCustomer.products.map((product, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {product}
                        <button
                          onClick={() => handleProductToggle(product, false)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button onClick={handleAddCustomer} className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Customer
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
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editCompanyName">Company Name *</Label>
                <Input
                  id="editCompanyName"
                  value={editingCustomer.companyName}
                  onChange={(e) => setEditingCustomer({...editingCustomer, companyName: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="editEmail">Contact Email *</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                  placeholder="security@company.com"
                />
              </div>
              <div>
                <Label>Associated Products</Label>
                <Select onValueChange={(value) => handleEditProductToggle(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select products to associate" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.filter(p => !editingCustomer.products.includes(p)).map((product) => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-1 mt-2">
                  {editingCustomer.products.map((product, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {product}
                      <button
                        onClick={() => handleEditProductToggle(product)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <Button onClick={handleUpdateCustomer} className="w-full bg-blue-600 hover:bg-blue-700">
                Update Customer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
