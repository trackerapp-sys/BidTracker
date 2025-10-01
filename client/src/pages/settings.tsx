import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
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
          <Button data-testid="button-save-token">Save Token</Button>
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
            <Switch data-testid="switch-outbid-notifications" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auction Ending Soon</Label>
              <p className="text-sm text-muted-foreground">
                Alert when auctions you're watching are ending soon
              </p>
            </div>
            <Switch data-testid="switch-ending-notifications" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Bid Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Notify on all new bids for your auctions
              </p>
            </div>
            <Switch data-testid="switch-new-bid-notifications" />
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
                defaultValue="10"
                data-testid="input-default-increment"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-duration">Default Duration (hours)</Label>
              <Input
                id="default-duration"
                type="number"
                defaultValue="24"
                data-testid="input-default-duration"
              />
            </div>
          </div>
          <Button data-testid="button-save-defaults">Save Defaults</Button>
        </CardContent>
      </Card>
    </div>
  );
}
