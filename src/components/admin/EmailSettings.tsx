import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Settings {
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
}

interface EmailSettingsProps {
  authMethod: string;
  settings: Settings;
  testEmailRecipient: string;
  onAuthMethodChange: (method: string) => void;
  onSettingsChange: (settings: Settings) => void;
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
  const [isSendingTest, setIsSendingTest] = useState(false);

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

    // Validate SMTP settings for test
    if (authMethod === 'smtp') {
      if (!settings.smtpHost || !settings.smtpUser || !settings.smtpPassword || !settings.fromEmail) {
        toast({
          title: "Error",
          description: "Please fill in all SMTP settings before testing.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSendingTest(true);
    console.log("Sending test email to:", testEmailRecipient);
    console.log("Using auth method:", authMethod);
    console.log("Email settings:", settings);
    
    try {
      const testEmailData = {
        to: testEmailRecipient,
        from: settings.fromEmail || 'test@cveadvisor.com',
        fromName: settings.fromName || 'CVEAdvisor',
        subject: 'CVEAdvisor Test Email',
        html: `
          <h1>Test Email from CVEAdvisor</h1>
          <p>This is a test email to verify your email configuration is working correctly.</p>
          <p><strong>Configuration used:</strong></p>
          <ul>
            <li>Auth Method: ${authMethod}</li>
            <li>SMTP Host: ${settings.smtpHost}</li>
            <li>SMTP Port: ${settings.smtpPort}</li>
            <li>From Email: ${settings.fromEmail}</li>
          </ul>
          <p>If you received this email, your configuration is working!</p>
          <p>Best regards,<br>CVEAdvisor Team</p>
        `,
        smtpHost: settings.smtpHost,
        smtpPort: parseInt(settings.smtpPort) || 587,
        smtpUser: settings.smtpUser,
        smtpPassword: settings.smtpPassword,
        smtpProtocol: settings.smtpProtocol,
        isTest: true
      };

      console.log('Calling send-email function with:', testEmailData);

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: testEmailData
      });

      if (error) {
        console.error("Email function error:", error);
        throw error;
      }

      console.log("Email function response:", data);

      if (data?.success) {
        toast({
          title: "Test Email Sent",
          description: `A test email has been sent to ${testEmailRecipient}. Please check your inbox and spam folder.`,
        });
      } else {
        throw new Error(data?.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error("Failed to send test email:", error);
      toast({
        title: "Error",
        description: `Failed to send test email: ${error.message}. Please check your settings and try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(false);
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
              <div>
                <Label htmlFor="smtp-host">SMTP Host *</Label>
                <Input
                  id="smtp-host"
                  className="w-64"
                  value={settings.smtpHost}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, smtpHost: e.target.value })
                  }
                  placeholder="smtp.gmail.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="smtp-protocol">Protocol</Label>
                <Select
                  value={settings.smtpProtocol}
                  onValueChange={(value) => onSettingsChange({ ...settings, smtpProtocol: value })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TLS">TLS</SelectItem>
                    <SelectItem value="SSL">SSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="smtp-port">SMTP Port *</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  className="w-24"
                  value={settings.smtpPort}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, smtpPort: e.target.value })
                  }
                  placeholder="587"
                  required
                />
              </div>
              <div>
                <Label htmlFor="smtp-user">SMTP Username *</Label>
                <Input
                  id="smtp-user"
                  type="email"
                  className="w-64"
                  value={settings.smtpUser}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, smtpUser: e.target.value })
                  }
                  placeholder="your-email@company.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="smtp-password">SMTP Password *</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  className="w-64"
                  value={settings.smtpPassword}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, smtpPassword: e.target.value })
                  }
                  placeholder="Your email password or app password"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  For Gmail, use an App Password instead of your regular password
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="client-id">Client ID</Label>
                <Input
                  id="client-id"
                  className="w-72"
                  value={settings.clientId}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, clientId: e.target.value })
                  }
                  placeholder="OAuth2 Client ID"
                />
              </div>
              <div>
                <Label htmlFor="client-secret">Client Secret</Label>
                <Input
                  id="client-secret"
                  type="password"
                  className="w-72"
                  value={settings.clientSecret}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, clientSecret: e.target.value })
                  }
                  placeholder="OAuth2 Client Secret"
                />
              </div>
              {settings.provider === "microsoft" && (
                <div>
                  <Label htmlFor="tenant-id">Tenant ID</Label>
                  <Input
                    id="tenant-id"
                    className="w-64"
                    value={settings.tenantId}
                    onChange={(e) =>
                      onSettingsChange({ ...settings, tenantId: e.target.value })
                    }
                    placeholder="Microsoft Tenant ID"
                  />
                </div>
              )}
            </>
          )}
          <div>
            <Label htmlFor="from-email">From Email *</Label>
            <Input
              id="from-email"
              type="email"
              className="w-64"
              value={settings.fromEmail}
              onChange={(e) =>
                onSettingsChange({ ...settings, fromEmail: e.target.value })
              }
              placeholder="alerts@company.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="from-name">From Name</Label>
            <Input
              id="from-name"
              className="w-48"
              value={settings.fromName}
              onChange={(e) =>
                onSettingsChange({ ...settings, fromName: e.target.value })
              }
              placeholder="CVEAdvisor"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="test-email-recipient">Test Email Recipient *</Label>
          <Input
            id="test-email-recipient"
            type="email"
            className="w-64"
            value={testEmailRecipient}
            onChange={(e) => onTestEmailRecipientChange(e.target.value)}
            placeholder="test@example.com"
            required
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
            disabled={isSendingTest}
          >
            {isSendingTest ? 'Sending...' : 'Send Test Email'}
          </Button>
        </div>

        {authMethod === 'smtp' && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-blue-900 mb-1">SMTP Setup Notes:</p>
            <ul className="text-blue-800 space-y-1 text-xs">
              <li>• For Gmail: Use smtp.gmail.com, port 587, and create an App Password</li>
              <li>• For Outlook: Use smtp.office365.com, port 587</li>
              <li>• Check spam folder if test emails don't arrive</li>
              </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
