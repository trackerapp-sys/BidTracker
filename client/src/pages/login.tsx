import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiFacebook } from "react-icons/si";
import { Gavel } from "lucide-react";

export default function Login() {
  const handleFacebookLogin = () => {
    console.log("Facebook login initiated");
    // TODO: Implement Facebook OAuth flow
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center">
            <Gavel className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl">Welcome to AuctionHub</CardTitle>
            <CardDescription className="mt-2">
              Host auctions right in your Facebook groups
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleFacebookLogin}
            className="w-full h-12 text-base"
            style={{ backgroundColor: "hsl(221, 44%, 41%)" }}
            data-testid="button-facebook-login"
          >
            <SiFacebook className="h-5 w-5 mr-2" />
            Continue with Facebook
          </Button>
          
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to connect your Facebook account
            </p>
            <p className="text-xs text-muted-foreground">
              We'll only access your groups and posting permissions
            </p>
          </div>

          <div className="pt-4 border-t space-y-3">
            <h3 className="font-semibold text-sm">What you can do:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                <span>Create individual post auctions in your groups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                <span>Host live feed auctions with inventory</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                <span>Track bids and manage multiple auctions</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
