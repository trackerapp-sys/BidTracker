import { AuctionCard } from "@/components/auction-card";
import { BidDialog } from "@/components/bid-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuctions, useCreateBid, useAuctionBids } from "@/hooks/api";
import { useCurrentUserId, useAuth } from "@/contexts/auth";

export default function Auctions() {
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUserId = useCurrentUserId();
  const { user } = useAuth();

  // Fetch real data using React Query
  const { data: auctions = [], isLoading } = useAuctions();
  const { data: selectedAuctionBids = [] } = useAuctionBids(selectedAuction || "");
  const createBidMutation = useCreateBid();
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

  // Filter auctions based on search query
  const filteredAuctions = useMemo(() => {
    return auctions.filter(auction =>
      auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (auction.description && auction.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [auctions, searchQuery]);

  // Transform auction data for display
  const displayAuctions = filteredAuctions.map(auction => ({
    id: auction.id,
    title: auction.title,
    facebookUrl: auction.facebookUrl || "",
    currentBid: parseFloat(auction.currentBid),
    bidCount: auction.bidCount,
    endTime: new Date(auction.endTime),
    status: auction.status === "ending-soon" ? "ending-soon" as const :
            auction.bidCount > 20 ? "hot" as const : "live" as const,
  }));

  // Get selected auction data
  const selectedAuctionData = auctions.find(a => a.id === selectedAuction);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading auctions...</p>
        </div>
      </div>
    );
  }

  if (filteredAuctions.length === 0 && !searchQuery) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground mb-2">No auctions yet</p>
          <p className="text-sm text-muted-foreground">Create your first auction to get started!</p>
        </div>
      </div>
    );
  }

  if (filteredAuctions.length === 0 && searchQuery) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">All Auctions</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-auctions"
          />
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground mb-2">No auctions found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
          </div>
        </div>
      </div>
    );
  }

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
          {displayAuctions.length} Active
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
          <p className="text-muted-foreground">
            {searchQuery ? "No auctions match your search." : "No active auctions at the moment."}
          </p>
        </div>
      )}

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
