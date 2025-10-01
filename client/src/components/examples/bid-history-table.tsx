import { BidHistoryTable } from "../bid-history-table";

export default function BidHistoryTableExample() {
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
  ];

  return (
    <div className="p-6">
      <BidHistoryTable bids={mockBids} />
    </div>
  );
}
