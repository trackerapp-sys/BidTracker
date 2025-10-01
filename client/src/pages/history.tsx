import { BidHistoryTable } from "@/components/bid-history-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserBids } from "@/hooks/api";
import { useMemo } from "react";
import { useCurrentUserId } from "@/contexts/auth";

export default function History() {
  const currentUserId = useCurrentUserId();

  // Fetch real data using React Query
  const { data: userBids = [], isLoading } = useUserBids(currentUserId);

  // Transform bid data for display and calculate stats
  const { displayBids, stats } = useMemo(() => {
    const transformedBids = userBids.map(bid => ({
      id: bid.id,
      auctionTitle: "Auction Title", // TODO: Join with auction data
      bidder: bid.bidder,
      amount: parseFloat(bid.amount),
      timestamp: new Date(bid.createdAt),
      status: bid.isWinning ? "winning" as const : "outbid" as const, // TODO: Determine actual status
    }));

    const calculatedStats = {
      totalBids: transformedBids.length,
      winning: transformedBids.filter(b => b.status === "winning").length,
      won: transformedBids.filter(b => b.status === "winning").length,
      totalSpent: transformedBids.filter(b => b.status === "winning").reduce((sum, b) => sum + b.amount, 0),
    };

    return { displayBids: transformedBids, stats: calculatedStats };
  }, [userBids]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading bid history...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Bid History</h1>
        <p className="text-muted-foreground mt-1">
          Track all your bids and auction activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Bids</CardDescription>
            <CardTitle className="text-2xl tabular-nums">{stats.totalBids}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Currently Winning</CardDescription>
            <CardTitle className="text-2xl tabular-nums text-success">{stats.winning}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Auctions Won</CardDescription>
            <CardTitle className="text-2xl tabular-nums text-primary">{stats.won}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Spent</CardDescription>
            <CardTitle className="text-2xl tabular-nums">${stats.totalSpent.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {displayBids.length > 0 ? (
        <BidHistoryTable bids={displayBids} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bid history yet. Start bidding on auctions!</p>
        </div>
      )}
    </div>
  );
}
