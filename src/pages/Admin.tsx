
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Key, Mail, Server, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { toast } = useToast();
  
  const [nvdSettings, setNvdSettings] = useState({
    apiKey: "",
    syncInterval: "6",
  });

  const [emailAuthMethod, setEmailAuthMethod] = useState("smtp");

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "CVEAdvisor",
    // OAuth2 settings
    clientId: "",
    clientSecret: "",
    tenantId: "", // For Microsoft
    provider: "google", // google or microsoft
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

  const [testEmailRecipient, setTestEmailRecipient] = useState("");

  const handleSaveNvdSettings = () => {
    console.log("Saving NVD settings:", nvdSettings);
    toast({
      title: "Settings Saved",
      description: "NVD API settings have been updated successfully.",
    });
  };

  const handleSaveEmailSettings = () => {
    console.log("Saving email settings:", { emailAuthMethod, emailSettings });
    toast({
      title: "Settings Saved", 
      description: "Email settings have been updated successfully.",
    });
  };

  const handleSaveEmailTemplate = () => {
    console.log("Saving email template:", emailTemplate);
    toast({
      title: "Template Saved",
      description: "Email template has been updated successfully.",
    });
  };

  const handleTestEmail = () => {
    if (!testEmailRecipient) {
      toast({
        title: "Error",
        description: "Please enter a recipient email address for the test.",
        variant: "destructive",
      });
      return;
    }

    console.log("Sending test email to:", testEmailRecipient);
    console.log("Using auth method:", emailAuthMethod);
    console.log("Email settings:", emailSettings);
    
    // In a real app, this would send a test email
    toast({
      title: "Test Email Sent",
      description: `A test email has been sent to ${testEmailRecipient} using ${emailAuthMethod === 'smtp' ? 'SMTP' : 'OAuth2'} authentication.`,
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
          <div>
            <Label htmlFor="auth-method">Authentication Method</Label>
            <Select value={emailAuthMethod} onValueChange={setEmailAuthMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select authentication method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smtp">SMTP with Password</SelectItem>
                <SelectItem value="oauth2">OAuth2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {emailAuthMethod === "oauth2" && (
            <div>
              <Label htmlFor="oauth-provider">OAuth2 Provider</Label>
              <Select 
                value={emailSettings.provider} 
                onValueChange={(value) => setEmailSettings({...emailSettings, provider: value as "google" | "microsoft"})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select OAuth2 provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="microsoft">Microsoft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailAuthMethod === "smtp" ? (
              <>
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
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="client-id">Client ID</Label>
                  <Input
                    id="client-id"
                    value={emailSettings.clientId}
                    onChange={(e) => setEmailSettings({...emailSettings, clientId: e.target.value})}
                    placeholder="OAuth2 Client ID"
                  />
                </div>
                <div>
                  <Label htmlFor="client-secret">Client Secret</Label>
                  <Input
                    id="client-secret"
                    type="password"
                    value={emailSettings.clientSecret}
                    onChange={(e) => setEmailSettings({...emailSettings, clientSecret: e.target.value})}
                    placeholder="OAuth2 Client Secret"
                  />
                </div>
                {emailSettings.provider === "microsoft" && (
                  <div>
                    <Label htmlFor="tenant-id">Tenant ID</Label>
                    <Input
                      id="tenant-id"
                      value={emailSettings.tenantId}
                      onChange={(e) => setEmailSettings({...emailSettings, tenantId: e.target.value})}
                      placeholder="Microsoft Tenant ID"
                    />
                  </div>
                )}
              </>
            )}
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

          <div>
            <Label htmlFor="test-email-recipient">Test Email Recipient</Label>
            <Input
              id="test-email-recipient"
              type="email"
              value={testEmailRecipient}
              onChange={(e) => setTestEmailRecipient(e.target.value)}
              placeholder="test@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">Enter email address to receive test emails</p>
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
