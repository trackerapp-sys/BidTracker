import { StatsCard } from "../stats-card";
import { Gavel, TrendingUp, DollarSign, Clock } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <StatsCard title="Active Auctions" value={24} icon={Gavel} trend={{ value: 12, isPositive: true }} />
      <StatsCard title="Total Bids Today" value={156} icon={TrendingUp} trend={{ value: 8, isPositive: true }} />
      <StatsCard title="Highest Current Bid" value="$2,450" icon={DollarSign} />
      <StatsCard title="Ending in <1 Hour" value={5} icon={Clock} trend={{ value: 3, isPositive: false }} />
    </div>
  );
}
