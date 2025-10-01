import { AuctionCard } from "../auction-card";

export default function AuctionCardExample() {
  const handlePlaceBid = (id: string) => {
    console.log("Place bid clicked for auction:", id);
  };

  return (
    <div className="p-6 max-w-sm">
      <AuctionCard
        id="1"
        title="Vintage 1967 Ford Mustang Fastback - Original Parts"
        facebookUrl="https://facebook.com/groups/123456/permalink/789012345/"
        currentBid={2450}
        bidCount={23}
        endTime={new Date(Date.now() + 2 * 60 * 60 * 1000)}
        status="hot"
        onPlaceBid={handlePlaceBid}
      />
    </div>
  );
}
