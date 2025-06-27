
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NvdSettingsProps {
  settings: {
    apiKey: string;
    syncInterval: string;
  };
  onSettingsChange: (settings: { apiKey: string; syncInterval: string }) => void;
}

export const NvdSettings = ({ settings, onSettingsChange }: NvdSettingsProps) => {
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSave = () => {
    console.log("Saving NVD settings:", settings);
    toast({
      title: "Settings Saved",
      description: "NVD API settings have been updated successfully.",
    });
  };

  const handleSyncNow = async () => {
    if (!settings.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your NVD API key before syncing.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    console.log("Starting manual NVD sync...");
    
    try {
      // Get email settings from parent component (Admin page)
      // In a real implementation, you'd pass these as props or get from context
      const emailSettings = {
        authMethod: 'smtp',
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        smtpPassword: '',
        fromEmail: '',
        fromName: 'CVEAdvisor'
      };

      const emailTemplate = {
        subject: 'Security Alert: New CVE found for $PRODUCT',
        body: `Dear $CUSTOMER,

We have detected a new critical vulnerability affecting your monitored product: $PRODUCT

CVE Details:
- CVE ID: $CVE_ID
- Severity: $SEVERITY
- Description: $DESCRIPTION
- CVSS Score: $CVSS_SCORE

Please review this vulnerability and take appropriate action to secure your systems.

Best regards,
CVEAdvisor Security Team`
      };

      const { data, error } = await supabase.functions.invoke('sync-nvd', {
        body: {
          nvdApiKey: settings.apiKey,
          emailSettings,
          emailTemplate
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Sync Complete",
        description: `Successfully processed ${data.processed || 0} vulnerabilities. Found ${data.newVulnerabilities || 0} new vulnerabilities.`,
      });
    } catch (error) {
      console.error("Failed to sync NVD data:", error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync with NVD. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-600" />
          <CardTitle>NVD API Configuration</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="nvd-api-key">API Key</Label>
          <div className="relative">
            <Input
              id="nvd-api-key"
              type={showApiKey ? "text" : "password"}
              value={settings.apiKey}
              onChange={(e) => onSettingsChange({...settings, apiKey: e.target.value})}
              placeholder="Enter your NVD API key"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from <a href="https://nvd.nist.gov/developers/request-an-api-key" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">NIST NVD</a>
          </p>
        </div>
        <div>
          <Label htmlFor="sync-interval">Sync Interval (hours)</Label>
          <Input
            id="sync-interval"
            type="number"
            value={settings.syncInterval}
            onChange={(e) => onSettingsChange({...settings, syncInterval: e.target.value})}
            placeholder="6"
            min="1"
            max="24"
          />
          <p className="text-xs text-gray-500 mt-1">How often to check for new vulnerabilities</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save NVD Settings
          </Button>
          <Button 
            onClick={handleSyncNow} 
            variant="outline"
            disabled={isSyncing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
