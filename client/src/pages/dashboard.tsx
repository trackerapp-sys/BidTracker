import { HeroSection } from "@/components/hero-section";
import { StatsCard } from "@/components/stats-card";
import { AuctionCard } from "@/components/auction-card";
import { Gavel, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useState } from "react";
import { BidDialog } from "@/components/bid-dialog";

export default function Dashboard() {
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);

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

  return (
    <div className="space-y-8">
      <HeroSection />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Active Auctions" value={24} icon={Gavel} trend={{ value: 12, isPositive: true }} />
        <StatsCard title="Total Bids Today" value={156} icon={TrendingUp} trend={{ value: 8, isPositive: true }} />
        <StatsCard title="Highest Current Bid" value="$2,450" icon={DollarSign} />
        <StatsCard title="Ending in <1 Hour" value={5} icon={Clock} trend={{ value: 3, isPositive: false }} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Hot Auctions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAuctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              {...auction}
              onPlaceBid={handlePlaceBid}
            />
          ))}
        </div>
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
