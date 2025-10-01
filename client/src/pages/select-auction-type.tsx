import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Radio, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function SelectAuctionType() {
  const [, setLocation] = useLocation();

  const auctionTypes = [
    {
      id: "individual",
      title: "Individual Post Auction",
      description: "Post one auction directly to your group",
      badge: "Simple & Quick",
      icon: FileText,
      gradient: "from-primary/20 to-primary/10",
      route: "/create/individual",
    },
    {
      id: "live-feed",
      title: "Live Feed Auction",
      description: "Host live auctions with inventory management",
      badge: "Pro Feature",
      icon: Radio,
      gradient: "from-accent/20 to-accent/10",
      route: "/create/live-feed",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Create Auction</h1>
        <p className="text-muted-foreground mt-1">
          Choose the type of auction you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {auctionTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer hover-elevate active-elevate-2 transition-all bg-gradient-to-br ${type.gradient} border-2 hover:border-primary/50`}
            onClick={() => setLocation(type.route)}
            data-testid={`card-auction-type-${type.id}`}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <type.icon className="h-6 w-6 text-primary" />
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  {type.badge}
                </Badge>
              </div>
              <div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <CardDescription className="mt-2 text-base">
                  {type.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-primary font-medium">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-muted/50">
        <h3 className="font-semibold mb-2">Not sure which to choose?</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Individual Post:</strong> Perfect for single items, quick setup</li>
          <li>• <strong>Live Feed:</strong> Best for multiple items, real-time bidding experience</li>
        </ul>
      </div>
    </div>
  );
}
