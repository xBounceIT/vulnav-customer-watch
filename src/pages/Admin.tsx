
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Key, Mail, Server, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { toast } = useToast();
  
  const [nvdSettings, setNvdSettings] = useState({
    apiKey: "",
    syncInterval: "6",
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "CVEAdvisor",
  });

  const [emailTemplate, setEmailTemplate] = useState({
    subject: "Security Alert: New CVE found for $PRODUCT",
    body: `Dear $CUSTOMER,

We have detected a new critical vulnerability affecting your monitored product: $PRODUCT

CVE Details:
- CVE ID: $CVE_ID
- Severity: $SEVERITY
- Description: $DESCRIPTION
- CVSS Score: $CVSS_SCORE

Please review this vulnerability and take appropriate action to secure your systems.

Best regards,
CVEAdvisor Security Team`,
  });

  const handleSaveNvdSettings = () => {
    // In a real app, this would save to the database
    toast({
      title: "Settings Saved",
      description: "NVD API settings have been updated successfully.",
    });
  };

  const handleSaveEmailSettings = () => {
    // In a real app, this would save to the database
    toast({
      title: "Settings Saved", 
      description: "Email settings have been updated successfully.",
    });
  };

  const handleSaveEmailTemplate = () => {
    // In a real app, this would save to the database
    toast({
      title: "Template Saved",
      description: "Email template has been updated successfully.",
    });
  };

  const handleTestEmail = () => {
    // In a real app, this would send a test email
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent using current settings.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-1">Configure system settings and integrations</p>
      </div>

      {/* NVD API Settings */}
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
            <Input
              id="nvd-api-key"
              type="password"
              value={nvdSettings.apiKey}
              onChange={(e) => setNvdSettings({...nvdSettings, apiKey: e.target.value})}
              placeholder="Enter your NVD API key"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get your API key from <a href="https://nvd.nist.gov/developers/request-an-api-key" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">NIST NVD</a>
            </p>
          </div>
          <div>
            <Label htmlFor="sync-interval">Sync Interval (hours)</Label>
            <Input
              id="sync-interval"
              type="number"
              value={nvdSettings.syncInterval}
              onChange={(e) => setNvdSettings({...nvdSettings, syncInterval: e.target.value})}
              placeholder="6"
              min="1"
              max="24"
            />
            <p className="text-xs text-gray-500 mt-1">How often to check for new vulnerabilities</p>
          </div>
          <Button onClick={handleSaveNvdSettings} className="bg-blue-600 hover:bg-blue-700">
            Save NVD Settings
          </Button>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-600" />
            <CardTitle>Email Notification Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input
                id="smtp-host"
                value={emailSettings.smtpHost}
                onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                placeholder="587"
              />
            </div>
            <div>
              <Label htmlFor="smtp-user">SMTP Username</Label>
              <Input
                id="smtp-user"
                value={emailSettings.smtpUser}
                onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                placeholder="your-email@company.com"
              />
            </div>
            <div>
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input
                id="smtp-password"
                type="password"
                value={emailSettings.smtpPassword}
                onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                placeholder="Your email password"
              />
            </div>
            <div>
              <Label htmlFor="from-email">From Email</Label>
              <Input
                id="from-email"
                type="email"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                placeholder="alerts@company.com"
              />
            </div>
            <div>
              <Label htmlFor="from-name">From Name</Label>
              <Input
                id="from-name"
                value={emailSettings.fromName}
                onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                placeholder="CVEAdvisor"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveEmailSettings} className="bg-blue-600 hover:bg-blue-700">
              Save Email Settings
            </Button>
            <Button onClick={handleTestEmail} variant="outline">
              Send Test Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Template */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            <CardTitle>Email Template</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email-subject">Subject Template</Label>
            <Input
              id="email-subject"
              value={emailTemplate.subject}
              onChange={(e) => setEmailTemplate({...emailTemplate, subject: e.target.value})}
              placeholder="Security Alert: New CVE found for $PRODUCT"
            />
          </div>
          <div>
            <Label htmlFor="email-body">Body Template</Label>
            <Textarea
              id="email-body"
              value={emailTemplate.body}
              onChange={(e) => setEmailTemplate({...emailTemplate, body: e.target.value})}
              placeholder="Email body template with variables"
              rows={10}
            />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Available Variables:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><code className="bg-gray-200 px-1 rounded">$CUSTOMER</code> - Customer company name</p>
              <p><code className="bg-gray-200 px-1 rounded">$PRODUCT</code> - Product name</p>
              <p><code className="bg-gray-200 px-1 rounded">$CVE_ID</code> - CVE identifier</p>
              <p><code className="bg-gray-200 px-1 rounded">$SEVERITY</code> - Vulnerability severity</p>
              <p><code className="bg-gray-200 px-1 rounded">$DESCRIPTION</code> - CVE description</p>
              <p><code className="bg-gray-200 px-1 rounded">$CVSS_SCORE</code> - CVSS score</p>
            </div>
          </div>
          <Button onClick={handleSaveEmailTemplate} className="bg-blue-600 hover:bg-blue-700">
            Save Email Template
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
