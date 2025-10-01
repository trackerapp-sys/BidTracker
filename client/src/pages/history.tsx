import { BidHistoryTable } from "@/components/bid-history-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function History() {
  //todo: remove mock functionality
  const mockBids = [
    {
      id: "1",
      auctionTitle: "Vintage 1967 Ford Mustang",
      bidder: "John Doe",
      amount: 2450,
      timestamp: new Date(Date.now() - 300000),
      status: "winning" as const,
    },
    {
      id: "2",
      auctionTitle: "Antique Victorian Chair",
      bidder: "Sarah Miller",
      amount: 850,
      timestamp: new Date(Date.now() - 600000),
      status: "outbid" as const,
    },
    {
      id: "3",
      auctionTitle: "Rare Comic Book Collection",
      bidder: "Mike Roberts",
      amount: 1200,
      timestamp: new Date(Date.now() - 900000),
      status: "won" as const,
    },
    {
      id: "4",
      auctionTitle: "Custom Gaming PC",
      bidder: "Emily Chen",
      amount: 3100,
      timestamp: new Date(Date.now() - 1200000),
      status: "outbid" as const,
    },
    {
      id: "5",
      auctionTitle: "Signed Baseball Collection",
      bidder: "David Park",
      amount: 5200,
      timestamp: new Date(Date.now() - 1500000),
      status: "outbid" as const,
    },
  ];

  const stats = {
    totalBids: mockBids.length,
    winning: mockBids.filter(b => b.status === "winning").length,
    won: mockBids.filter(b => b.status === "won").length,
    totalSpent: mockBids.filter(b => b.status === "won").reduce((sum, b) => sum + b.amount, 0),
  };

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

      <BidHistoryTable bids={mockBids} />
    </div>
  );
}
