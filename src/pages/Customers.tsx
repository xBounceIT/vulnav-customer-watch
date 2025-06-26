
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Mail, Building } from "lucide-react";
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

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const [newCustomer, setNewCustomer] = useState({
    companyName: "",
    email: "",
    products: "",
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

    const customer: Customer = {
      id: Math.max(...customers.map(c => c.id)) + 1,
      companyName: newCustomer.companyName,
      email: newCustomer.email,
      products: newCustomer.products.split(',').map(p => p.trim()).filter(p => p),
      enabled: true,
    };

    setCustomers([...customers, customer]);
    setNewCustomer({ companyName: "", email: "", products: "" });
    setIsAddDialogOpen(false);
    toast({
      title: "Customer Added",
      description: "New customer has been added successfully.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage customer accounts and monitoring settings</p>
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
                <Label htmlFor="products">Associated Products</Label>
                <Input
                  id="products"
                  value={newCustomer.products}
                  onChange={(e) => setNewCustomer({...newCustomer, products: e.target.value})}
                  placeholder="Product1, Product2, Product3"
                />
              </div>
              <Button onClick={handleAddCustomer} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                  <Button variant="outline" size="sm">
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
    </div>
  );
};

export default Customers;
