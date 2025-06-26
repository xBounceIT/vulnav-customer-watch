
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailTemplateProps {
  template: {
    subject: string;
    body: string;
  };
  onTemplateChange: (template: { subject: string; body: string }) => void;
}

export const EmailTemplate = ({ template, onTemplateChange }: EmailTemplateProps) => {
  const { toast } = useToast();

  const handleSave = () => {
    console.log("Saving email template:", template);
    toast({
      title: "Template Saved",
      description: "Email template has been updated successfully.",
    });
  };

  return (
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
            value={template.subject}
            onChange={(e) => onTemplateChange({...template, subject: e.target.value})}
            placeholder="Security Alert: New CVE found for $PRODUCT"
          />
        </div>
        <div>
          <Label htmlFor="email-body">Body Template</Label>
          <Textarea
            id="email-body"
            value={template.body}
            onChange={(e) => onTemplateChange({...template, body: e.target.value})}
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
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save Email Template
        </Button>
      </CardContent>
    </Card>
  );
};
