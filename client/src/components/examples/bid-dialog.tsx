import { BidDialog } from "../bid-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BidDialogExample() {
  const [open, setOpen] = useState(false);

  const mockAuction = {
    id: "1",
    title: "Vintage 1967 Ford Mustang Fastback - Original Parts",
    currentBid: 2450,
    minIncrement: 50,
    bids: [
      { id: "1", bidder: "John D.", amount: 2450, timestamp: new Date(Date.now() - 300000) },
      { id: "2", bidder: "Sarah M.", amount: 2400, timestamp: new Date(Date.now() - 600000) },
      { id: "3", bidder: "Mike R.", amount: 2350, timestamp: new Date(Date.now() - 900000) },
    ],
  };

  const handleSubmitBid = (auctionId: string, amount: number) => {
    console.log("Bid submitted:", { auctionId, amount });
  };

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Bid Dialog</Button>
      <BidDialog
        open={open}
        onOpenChange={setOpen}
        auction={mockAuction}
        onSubmitBid={handleSubmitBid}
      />
    </div>
  );
}
