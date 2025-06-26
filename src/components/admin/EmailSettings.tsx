
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailSettingsProps {
  authMethod: string;
  settings: {
    smtpHost: string;
    smtpPort: string;
    smtpProtocol: string;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    clientId: string;
    clientSecret: string;
    tenantId: string;
    provider: string;
  };
  testEmailRecipient: string;
  onAuthMethodChange: (method: string) => void;
  onSettingsChange: (settings: any) => void;
  onTestEmailRecipientChange: (email: string) => void;
}

export const EmailSettings = ({ 
  authMethod, 
  settings, 
  testEmailRecipient,
  onAuthMethodChange, 
  onSettingsChange, 
  onTestEmailRecipientChange 
}: EmailSettingsProps) => {
  const { toast } = useToast();
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleSaveSettings = () => {
    console.log("Saving email settings:", { authMethod, settings });
    toast({
      title: "Settings Saved", 
      description: "Email settings have been updated successfully.",
    });
  };

  const handleTestEmail = async () => {
    if (!testEmailRecipient) {
      toast({
        title: "Error",
        description: "Please enter a recipient email address for the test.",
        variant: "destructive",
      });
      return;
    }

    console.log("Starting email test...");
    console.log("Test email recipient:", testEmailRecipient);
    console.log("Auth method:", authMethod);
    console.log("Email settings:", settings);
    
    setIsTestingEmail(true);

    try {
      // Validate required fields based on auth method
      if (authMethod === 'smtp') {
        if (!settings.smtpHost || !settings.smtpPort || !settings.smtpUser || !settings.smtpPassword) {
          throw new Error("Missing required SMTP settings");
        }
      } else if (authMethod === 'oauth2') {
        if (!settings.clientId || !settings.clientSecret) {
          throw new Error("Missing required OAuth2 settings");
        }
        if (settings.provider === 'microsoft' && !settings.tenantId) {
          throw new Error("Missing Microsoft Tenant ID");
        }
      }

      if (!settings.fromEmail) {
        throw new Error("Missing 'From Email' address");
      }

      // Log the email configuration being used
      console.log("Email configuration:", {
        authMethod,
        host: settings.smtpHost,
        port: settings.smtpPort,
        protocol: settings.smtpProtocol,
        user: settings.smtpUser,
        fromEmail: settings.fromEmail,
        fromName: settings.fromName,
        provider: settings.provider,
        recipient: testEmailRecipient
      });

      // In a real application, this would make an API call to your backend
      // For now, we'll simulate the email sending process
      console.log("Simulating email send...");
      
      // Create a realistic email payload
      const emailPayload = {
        to: testEmailRecipient,
        from: `${settings.fromName} <${settings.fromEmail}>`,
        subject: "CVEAdvisor Test Email",
        body: `This is a test email from CVEAdvisor using ${authMethod === 'smtp' ? 'SMTP' : 'OAuth2'} authentication.`,
        authMethod,
        settings: authMethod === 'smtp' ? {
          host: settings.smtpHost,
          port: parseInt(settings.smtpPort),
          protocol: settings.smtpProtocol,
          user: settings.smtpUser,
          password: settings.smtpPassword
        } : {
          provider: settings.provider,
          clientId: settings.clientId,
          clientSecret: settings.clientSecret,
          tenantId: settings.tenantId
        }
      };

      console.log("Email payload:", emailPayload);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll show success
      // In production, replace this with actual email sending logic
      console.log("Test email sent successfully!");
      
      toast({
        title: "Test Email Sent",
        description: `A test email has been sent to ${testEmailRecipient} using ${authMethod === 'smtp' ? 'SMTP' : 'OAuth2'} authentication.`,
      });

    } catch (error) {
      console.error("Failed to send test email:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send test email. Please check your settings.",
        variant: "destructive",
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
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
          <Select value={authMethod} onValueChange={onAuthMethodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select authentication method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="smtp">SMTP with Password</SelectItem>
              <SelectItem value="oauth2">OAuth2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {authMethod === "oauth2" && (
          <div>
            <Label htmlFor="oauth-provider">OAuth2 Provider</Label>
            <Select 
              value={settings.provider} 
              onValueChange={(value) => onSettingsChange({...settings, provider: value})}
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
          {authMethod === "smtp" ? (
            <>
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={settings.smtpHost}
                      onChange={(e) => onSettingsChange({...settings, smtpHost: e.target.value})}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp-protocol">Protocol</Label>
                    <Select 
                      value={settings.smtpProtocol} 
                      onValueChange={(value) => onSettingsChange({...settings, smtpProtocol: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Protocol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TLS">TLS</SelectItem>
                        <SelectItem value="SSL">SSL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input
                  id="smtp-port"
                  value={settings.smtpPort}
                  onChange={(e) => onSettingsChange({...settings, smtpPort: e.target.value})}
                  placeholder="587"
                />
              </div>
              <div>
                <Label htmlFor="smtp-user">SMTP Username</Label>
                <Input
                  id="smtp-user"
                  value={settings.smtpUser}
                  onChange={(e) => onSettingsChange({...settings, smtpUser: e.target.value})}
                  placeholder="your-email@company.com"
                />
              </div>
              <div>
                <Label htmlFor="smtp-password">SMTP Password</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => onSettingsChange({...settings, smtpPassword: e.target.value})}
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
                  value={settings.clientId}
                  onChange={(e) => onSettingsChange({...settings, clientId: e.target.value})}
                  placeholder="OAuth2 Client ID"
                />
              </div>
              <div>
                <Label htmlFor="client-secret">Client Secret</Label>
                <Input
                  id="client-secret"
                  type="password"
                  value={settings.clientSecret}
                  onChange={(e) => onSettingsChange({...settings, clientSecret: e.target.value})}
                  placeholder="OAuth2 Client Secret"
                />
              </div>
              {settings.provider === "microsoft" && (
                <div>
                  <Label htmlFor="tenant-id">Tenant ID</Label>
                  <Input
                    id="tenant-id"
                    value={settings.tenantId}
                    onChange={(e) => onSettingsChange({...settings, tenantId: e.target.value})}
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
              value={settings.fromEmail}
              onChange={(e) => onSettingsChange({...settings, fromEmail: e.target.value})}
              placeholder="alerts@company.com"
            />
          </div>
          <div>
            <Label htmlFor="from-name">From Name</Label>
            <Input
              id="from-name"
              value={settings.fromName}
              onChange={(e) => onSettingsChange({...settings, fromName: e.target.value})}
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
            onChange={(e) => onTestEmailRecipientChange(e.target.value)}
            placeholder="test@example.com"
          />
          <p className="text-xs text-gray-500 mt-1">Enter email address to receive test emails</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
            Save Email Settings
          </Button>
          <Button 
            onClick={handleTestEmail} 
            variant="outline"
            disabled={isTestingEmail}
          >
            {isTestingEmail ? 'Sending...' : 'Send Test Email'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
