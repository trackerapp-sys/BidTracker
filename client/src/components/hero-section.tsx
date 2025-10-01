import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Auction_hero_banner_image_0d129587.png";

export function HeroSection() {
  return (
    <div className="relative h-64 overflow-hidden rounded-lg">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-hero-title">
          Manage Facebook Group Auctions with Precision
        </h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
          Track bids in real-time, manage multiple auctions, and streamline your Facebook group auction workflow
        </p>
        <div className="flex gap-3">
          <Button size="lg" data-testid="button-create-auction-hero">
            Create Auction
          </Button>
          <Button variant="outline" size="lg" className="backdrop-blur-sm" data-testid="button-view-auctions">
            View Live Auctions
          </Button>
        </div>
      </div>
    </div>
  );
}
