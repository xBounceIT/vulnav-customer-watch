
import { useState } from "react";
import { NvdSettings } from "@/components/admin/NvdSettings";
import { EmailSettings } from "@/components/admin/EmailSettings";
import { EmailTemplate } from "@/components/admin/EmailTemplate";

const Admin = () => {
  const [nvdSettings, setNvdSettings] = useState({
    apiKey: "",
    syncInterval: "6",
  });

  const [emailAuthMethod, setEmailAuthMethod] = useState("smtp");

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpProtocol: "TLS",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "CVEAdvisor",
    clientId: "",
    clientSecret: "",
    tenantId: "",
    provider: "google",
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-1">Configure system settings and integrations</p>
      </div>

      <NvdSettings 
        settings={nvdSettings}
        onSettingsChange={setNvdSettings}
      />

      <EmailSettings
        authMethod={emailAuthMethod}
        settings={emailSettings}
        testEmailRecipient={testEmailRecipient}
        onAuthMethodChange={setEmailAuthMethod}
        onSettingsChange={setEmailSettings}
        onTestEmailRecipientChange={setTestEmailRecipient}
      />

      <EmailTemplate
        template={emailTemplate}
        onTemplateChange={setEmailTemplate}
      />
    </div>
  );
};

export default Admin;
