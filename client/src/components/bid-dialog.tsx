import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Bid {
  id: string;
  bidder: string;
  amount: number;
  timestamp: Date;
}

interface BidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auction: {
    id: string;
    title: string;
    currentBid: number;
    minIncrement: number;
    bids: Bid[];
  };
  onSubmitBid: (auctionId: string, amount: number) => void;
}

export function BidDialog({ open, onOpenChange, auction, onSubmitBid }: BidDialogProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minBid = auction.currentBid + auction.minIncrement;

  const handleSubmit = async () => {
    const amount = parseFloat(bidAmount);
    if (amount < minBid) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSubmitBid(auction.id, amount);
    setIsSubmitting(false);
    setBidAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-place-bid">
        <DialogHeader>
          <DialogTitle>Place Your Bid</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {auction.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="bid-amount">Your Bid Amount</Label>
              <span className="text-sm text-muted-foreground">
                Min: ${minBid.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="bid-amount"
                type="number"
                placeholder={minBid.toString()}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="pl-7"
                min={minBid}
                step={auction.minIncrement}
                data-testid="input-bid-amount"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Recent Bid History</Label>
            <ScrollArea className="h-[150px] rounded-md border p-3">
              <div className="space-y-3">
                {auction.bids.slice(0, 5).map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {bid.bidder.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{bid.bidder}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(bid.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums">
                      ${bid.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-bid"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!bidAmount || parseFloat(bidAmount) < minBid || isSubmitting}
            data-testid="button-submit-bid"
          >
            {isSubmitting ? "Submitting..." : "Confirm Bid"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
