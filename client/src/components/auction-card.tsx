import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "./countdown-timer";
import { ExternalLink, MessageSquare } from "lucide-react";
import { useState } from "react";

interface AuctionCardProps {
  id: string;
  title: string;
  facebookUrl: string;
  currentBid: number;
  bidCount: number;
  endTime: Date;
  status: "live" | "ending-soon" | "hot";
  imageUrl?: string;
  onPlaceBid: (id: string) => void;
}

export function AuctionCard({
  id,
  title,
  facebookUrl,
  currentBid,
  bidCount,
  endTime,
  status,
  imageUrl,
  onPlaceBid,
}: AuctionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    live: { label: "Live", color: "bg-primary" },
    "ending-soon": { label: "Ending Soon", color: "bg-warning" },
    hot: { label: "Hot", color: "bg-destructive" },
  };

  const truncateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + "..." + urlObj.pathname.slice(-20);
    } catch {
      return url.slice(0, 40) + "...";
    }
  };

  return (
    <Card
      className="overflow-hidden hover-elevate transition-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-auction-${id}`}
    >
      <div className="relative h-48 bg-muted overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className={`${statusConfig[status].color} text-white`}>
            {statusConfig[status].label}
          </Badge>
        </div>
      </div>
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg line-clamp-2" data-testid={`text-title-${id}`}>
          {title}
        </CardTitle>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          data-testid={`link-facebook-${id}`}
        >
          <ExternalLink className="h-3 w-3" />
          <span className="truncate">{truncateUrl(facebookUrl)}</span>
        </a>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Current Bid</p>
          <p className="text-2xl font-bold tabular-nums" data-testid={`text-bid-${id}`}>
            ${currentBid.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground" data-testid={`text-bid-count-${id}`}>
              {bidCount} {bidCount === 1 ? "bid" : "bids"}
            </span>
          </div>
          <CountdownTimer endTime={endTime} compact />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onPlaceBid(id)}
          data-testid={`button-place-bid-${id}`}
        >
          Place Bid
        </Button>
      </CardFooter>
    </Card>
  );
}
