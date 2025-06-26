
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NvdSettingsProps {
  settings: {
    apiKey: string;
    syncInterval: string;
  };
  onSettingsChange: (settings: { apiKey: string; syncInterval: string }) => void;
}

export const NvdSettings = ({ settings, onSettingsChange }: NvdSettingsProps) => {
  const { toast } = useToast();

  const handleSave = () => {
    console.log("Saving NVD settings:", settings);
    toast({
      title: "Settings Saved",
      description: "NVD API settings have been updated successfully.",
    });
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
          <Input
            id="nvd-api-key"
            type="password"
            value={settings.apiKey}
            onChange={(e) => onSettingsChange({...settings, apiKey: e.target.value})}
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
            value={settings.syncInterval}
            onChange={(e) => onSettingsChange({...settings, syncInterval: e.target.value})}
            placeholder="6"
            min="1"
            max="24"
          />
          <p className="text-xs text-gray-500 mt-1">How often to check for new vulnerabilities</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save NVD Settings
        </Button>
      </CardContent>
    </Card>
  );
};
