import { AuctionCard } from "@/components/auction-card";
import { BidDialog } from "@/components/bid-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Auctions() {
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  //todo: remove mock functionality
  const mockAuctions = [
    {
      id: "1",
      title: "Vintage 1967 Ford Mustang Fastback - Original Parts",
      facebookUrl: "https://facebook.com/groups/123456/permalink/789012345/",
      currentBid: 2450,
      bidCount: 23,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: "hot" as const,
    },
    {
      id: "2",
      title: "Antique Victorian Dining Chair Set (6 pieces)",
      facebookUrl: "https://facebook.com/groups/123456/permalink/789012346/",
      currentBid: 850,
      bidCount: 12,
      endTime: new Date(Date.now() + 30 * 60 * 1000),
      status: "ending-soon" as const,
    },
    {
      id: "3",
      title: "Rare Comic Book Collection - First Editions",
      facebookUrl: "https://facebook.com/groups/123456/permalink/789012347/",
      currentBid: 1200,
      bidCount: 18,
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
      status: "live" as const,
    },
    {
      id: "4",
      title: "Custom Gaming PC - RTX 4090, 64GB RAM",
      facebookUrl: "https://facebook.com/groups/123456/permalink/789012348/",
      currentBid: 3200,
      bidCount: 31,
      endTime: new Date(Date.now() + 45 * 60 * 1000),
      status: "ending-soon" as const,
    },
    {
      id: "5",
      title: "Signed Baseball Collection - Babe Ruth Era",
      facebookUrl: "https://facebook.com/groups/123456/permalink/789012349/",
      currentBid: 5400,
      bidCount: 42,
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      status: "hot" as const,
    },
    {
      id: "6",
      title: "Vintage Rolex Submariner 1960s",
      facebookUrl: "https://facebook.com/groups/123456/permalink/789012350/",
      currentBid: 8900,
      bidCount: 56,
      endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
      status: "live" as const,
    },
  ];

  const mockBidData = {
    id: selectedAuction || "1",
    title: mockAuctions.find(a => a.id === selectedAuction)?.title || mockAuctions[0].title,
    currentBid: mockAuctions.find(a => a.id === selectedAuction)?.currentBid || mockAuctions[0].currentBid,
    minIncrement: 50,
    bids: [
      { id: "1", bidder: "John D.", amount: 2450, timestamp: new Date(Date.now() - 300000) },
      { id: "2", bidder: "Sarah M.", amount: 2400, timestamp: new Date(Date.now() - 600000) },
      { id: "3", bidder: "Mike R.", amount: 2350, timestamp: new Date(Date.now() - 900000) },
    ],
  };

  const handlePlaceBid = (id: string) => {
    console.log("Place bid for auction:", id);
    setSelectedAuction(id);
    setBidDialogOpen(true);
  };

  const handleSubmitBid = (auctionId: string, amount: number) => {
    console.log("Bid submitted:", { auctionId, amount });
  };

  const filteredAuctions = mockAuctions.filter(auction =>
    auction.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Live Auctions</h1>
          <p className="text-muted-foreground mt-1">
            Browse and bid on active auctions
          </p>
        </div>
        <Badge className="bg-success text-white">
          {mockAuctions.length} Active
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search auctions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-auctions"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuctions.map((auction) => (
          <AuctionCard
            key={auction.id}
            {...auction}
            onPlaceBid={handlePlaceBid}
          />
        ))}
      </div>

      <BidDialog
        open={bidDialogOpen}
        onOpenChange={setBidDialogOpen}
        auction={mockBidData}
        onSubmitBid={handleSubmitBid}
      />
    </div>
  );
}
