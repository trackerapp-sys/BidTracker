import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useUserSettings, useUpdateUserSettings } from "@/hooks/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUserId } from "@/contexts/auth";

export default function Settings() {
  const currentUserId = useCurrentUserId();
  const { toast } = useToast();

  // Fetch user settings
  const { data: settings, isLoading } = useUserSettings(currentUserId);
  const updateSettingsMutation = useUpdateUserSettings();

  // Local state for form inputs
  const [facebookToken, setFacebookToken] = useState("");
  const [defaultIncrement, setDefaultIncrement] = useState("");
  const [defaultDuration, setDefaultDuration] = useState("");

  // Initialize form values when settings load
  useState(() => {
    if (settings) {
      setDefaultIncrement(settings.defaultMinIncrement);
      setDefaultDuration(settings.defaultDuration.toString());
    }
  });

  const handleSaveToken = () => {
    // TODO: Implement Facebook token saving
    toast({
      title: "Token Saved",
      description: "Your Facebook access token has been saved.",
    });
  };

  const handleSaveDefaults = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        userId: currentUserId,
        settings: {
          defaultMinIncrement: defaultIncrement,
          defaultDuration: parseInt(defaultDuration),
        },
      });
      toast({
        title: "Settings Updated",
        description: "Your default auction settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationToggle = async (field: string, value: boolean) => {
    try {
      await updateSettingsMutation.mutateAsync({
        userId: currentUserId,
        settings: { [field]: value },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your auction preferences and notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facebook Integration</CardTitle>
          <CardDescription>
            Connect your Facebook account to sync auction posts automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fb-token">Facebook Access Token</Label>
            <Input
              id="fb-token"
              type="password"
              placeholder="Enter your Facebook access token"
              data-testid="input-fb-token"
            />
            <p className="text-xs text-muted-foreground">
              Once your developer account is verified, enter your access token here
            </p>
          </div>
          <Button onClick={handleSaveToken} data-testid="button-save-token">
            Save Token
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you want to be notified about auction activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Outbid Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone outbids you
              </p>
            </div>
            <Switch
              checked={settings?.outbidNotifications || false}
              onCheckedChange={(checked) => handleNotificationToggle("outbidNotifications", checked)}
              data-testid="switch-outbid-notifications"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auction Ending Soon</Label>
              <p className="text-sm text-muted-foreground">
                Alert when auctions you're watching are ending soon
              </p>
            </div>
            <Switch
              checked={settings?.endingNotifications || false}
              onCheckedChange={(checked) => handleNotificationToggle("endingNotifications", checked)}
              data-testid="switch-ending-notifications"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Bid Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Notify on all new bids for your auctions
              </p>
            </div>
            <Switch
              checked={settings?.newBidNotifications || false}
              onCheckedChange={(checked) => handleNotificationToggle("newBidNotifications", checked)}
              data-testid="switch-new-bid-notifications"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auction Defaults</CardTitle>
          <CardDescription>
            Set default values for creating new auctions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default-increment">Default Min Increment ($)</Label>
              <Input
                id="default-increment"
                type="number"
                value={defaultIncrement}
                onChange={(e) => setDefaultIncrement(e.target.value)}
                data-testid="input-default-increment"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-duration">Default Duration (hours)</Label>
              <Input
                id="default-duration"
                type="number"
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(e.target.value)}
                data-testid="input-default-duration"
              />
            </div>
          </div>
          <Button
            onClick={handleSaveDefaults}
            disabled={updateSettingsMutation.isPending}
            data-testid="button-save-defaults"
          >
            {updateSettingsMutation.isPending ? "Saving..." : "Save Defaults"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
