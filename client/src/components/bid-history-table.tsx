import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface BidHistoryItem {
  id: string;
  auctionTitle: string;
  bidder: string;
  amount: number;
  timestamp: Date;
  status: "winning" | "outbid" | "won" | "lost";
}

interface BidHistoryTableProps {
  bids: BidHistoryItem[];
}

export function BidHistoryTable({ bids }: BidHistoryTableProps) {
  const statusConfig = {
    winning: { label: "Winning", color: "bg-success text-white" },
    outbid: { label: "Outbid", color: "bg-destructive text-white" },
    won: { label: "Won", color: "bg-primary text-white" },
    lost: { label: "Lost", color: "bg-muted" },
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Auction</TableHead>
            <TableHead>Bidder</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid) => (
            <TableRow key={bid.id} data-testid={`row-bid-${bid.id}`}>
              <TableCell className="font-medium">{bid.auctionTitle}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {bid.bidder.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{bid.bidder}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                ${bid.amount.toLocaleString()}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(bid.timestamp).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge className={statusConfig[bid.status].color}>
                  {statusConfig[bid.status].label}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
