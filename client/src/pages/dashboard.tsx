import { HeroSection } from "@/components/hero-section";
import { StatsCard } from "@/components/stats-card";
import { AuctionCard } from "@/components/auction-card";
import { Gavel, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useState } from "react";
import { BidDialog } from "@/components/bid-dialog";
import { useAuctions, useDashboardStats, useCreateBid, useAuctionBids } from "@/hooks/api";
import { useCurrentUserId, useAuth } from "@/contexts/auth";
import { useWebSocket } from "@/hooks/websocket";

export default function Dashboard() {
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);

  const currentUserId = useCurrentUserId();
  const { user } = useAuth();
  const { isConnected } = useWebSocket();

  // Fetch real data using React Query
  const { data: auctions = [], isLoading: auctionsLoading } = useAuctions({
    status: "live",
    limit: 6
  });

  const { data: stats, isLoading: statsLoading } = useDashboardStats(currentUserId);

  const { data: selectedAuctionBids = [] } = useAuctionBids(selectedAuction || "");

  const createBidMutation = useCreateBid();

  // Get selected auction data
  const selectedAuctionData = auctions.find(a => a.id === selectedAuction);

  const handlePlaceBid = (id: string) => {
    setSelectedAuction(id);
    setBidDialogOpen(true);
  };

  const handleSubmitBid = async (auctionId: string, amount: number) => {
    try {
      await createBidMutation.mutateAsync({
        amount: amount.toString(),
        bidder: user?.name || user?.username || "Anonymous",
        auctionId,
        userId: currentUserId,
      });
      setBidDialogOpen(false);
    } catch (error) {
      console.error("Failed to place bid:", error);
    }
  };

  // Transform auction data for display
  const displayAuctions = auctions.map(auction => ({
    id: auction.id,
    title: auction.title,
    facebookUrl: auction.facebookUrl || "",
    currentBid: parseFloat(auction.currentBid),
    bidCount: auction.bidCount,
    endTime: new Date(auction.endTime),
    status: auction.status === "ending-soon" ? "ending-soon" as const :
            auction.bidCount > 20 ? "hot" as const : "live" as const,
  }));

  // Prepare bid dialog data
  const bidDialogData = selectedAuctionData ? {
    id: selectedAuctionData.id,
    title: selectedAuctionData.title,
    currentBid: parseFloat(selectedAuctionData.currentBid),
    minIncrement: parseFloat(selectedAuctionData.minIncrement),
    bids: selectedAuctionBids.map(bid => ({
      id: bid.id,
      bidder: bid.bidder,
      amount: parseFloat(bid.amount),
      timestamp: new Date(bid.createdAt),
    })),
  } : null;

  if (auctionsLoading || statsLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <HeroSection />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Auctions"
          value={stats?.activeAuctions || 0}
          icon={Gavel}
        />
        <StatsCard
          title="Total Bids Today"
          value={stats?.totalBidsToday || 0}
          icon={TrendingUp}
        />
        <StatsCard
          title="Highest Current Bid"
          value={stats?.highestCurrentBid || "$0"}
          icon={DollarSign}
        />
        <StatsCard
          title="Ending in <1 Hour"
          value={stats?.endingInOneHour || 0}
          icon={Clock}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Live Auctions</h2>
        {displayAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayAuctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                {...auction}
                onPlaceBid={handlePlaceBid}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No active auctions at the moment.</p>
          </div>
        )}
      </div>

      {bidDialogData && (
        <BidDialog
          open={bidDialogOpen}
          onOpenChange={setBidDialogOpen}
          auction={bidDialogData}
          onSubmitBid={handleSubmitBid}
        />
      )}
    </div>
  );
}
