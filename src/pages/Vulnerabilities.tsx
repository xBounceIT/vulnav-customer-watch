
import { useState, useEffect, useCallback } from "react";
import { Search, AlertTriangle, Calendar, ExternalLink, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Vulnerability {
  id: string;
  cve_id: string;
  description: string;
  severity: string;
  cvss_score: number;
  vendor: string;
  product: string;
  published_date: string;
  last_modified: string;
}

const Vulnerabilities = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [filteredVulnerabilities, setFilteredVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch vulnerabilities from database
  const fetchVulnerabilities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('vulnerabilities')
        .select('*')
        .order('published_date', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching vulnerabilities:', error);
        toast({
          title: "Error",
          description: "Failed to fetch vulnerabilities from database",
          variant: "destructive",
        });
        return;
      }

      setVulnerabilities(data || []);
      setFilteredVulnerabilities(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load vulnerabilities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial load
  useEffect(() => {
    fetchVulnerabilities();
  }, [fetchVulnerabilities]);

  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredVulnerabilities(vulnerabilities);
      return;
    }

    const filtered = vulnerabilities.filter(vuln =>
      vuln.cve_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredVulnerabilities(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchVulnerabilities();
    setRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Vulnerability data has been refreshed",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vulnerabilities</h1>
            <p className="text-gray-600">Loading vulnerability data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="h-8 w-8 text-red-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vulnerabilities</h1>
          <p className="text-gray-600">Search and monitor security vulnerabilities</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Vulnerabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search by CVE ID, product name, or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-base"
              />
            </div>
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vulnerability Database</CardTitle>
          <p className="text-sm text-gray-600">
            Found {filteredVulnerabilities.length} vulnerabilities
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CVE ID</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVulnerabilities.map((vuln) => (
                  <TableRow key={vuln.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm font-medium">
                      {vuln.cve_id}
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(vuln.severity)}>
                        {vuln.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {vuln.cvss_score || 'N/A'}
                    </TableCell>
                    <TableCell>{vuln.vendor}</TableCell>
                    <TableCell>{vuln.product}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {vuln.published_date}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate" title={vuln.description}>
                        {vuln.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => window.open(`https://nvd.nist.gov/vuln/detail/${vuln.cve_id}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredVulnerabilities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No vulnerabilities found matching your search criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search terms or check the spelling.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Vulnerabilities;
