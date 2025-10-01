import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiFacebook } from "react-icons/si";
import { Plus, Trash2, GripVertical, Play, Pause, SkipForward } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InventoryItem {
  id: string;
  name: string;
  startingBid: number;
  description: string;
}

export default function CreateLiveFeed() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", startingBid: "", description: "" });
  const [sessionSettings, setSessionSettings] = useState({
    bidIncrement: "5",
    itemDuration: "5",
  });

  //todo: remove mock functionality
  const mockGroups = [
    { id: "1", name: "Vintage Car Enthusiasts", members: "2.3K" },
    { id: "2", name: "Antique Collectors Market", members: "5.1K" },
  ];

  const addItem = () => {
    if (newItem.name && newItem.startingBid) {
      setInventory([
        ...inventory,
        {
          id: Date.now().toString(),
          name: newItem.name,
          startingBid: parseFloat(newItem.startingBid),
          description: newItem.description,
        },
      ]);
      setNewItem({ name: "", startingBid: "", description: "" });
    }
  };

  const removeItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const toggleLive = () => {
    if (!isLive && inventory.length === 0) {
      alert("Please add items to your inventory first");
      return;
    }
    setIsLive(!isLive);
    console.log(isLive ? "Paused auction" : "Started live auction");
  };

  const nextItem = () => {
    if (currentItemIndex < inventory.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      console.log("Moved to next item");
    }
  };

  const currentItem = inventory[currentItemIndex];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Live Feed Auction
          {isLive && (
            <Badge className="bg-destructive text-destructive-foreground animate-pulse">
              🔴 LIVE
            </Badge>
          )}
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage real-time auctions with inventory
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Inventory */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Inventory ({inventory.length})</CardTitle>
            <CardDescription>Add items to auction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  data-testid="input-item-name"
                />
              </div>
              <div>
                <Label htmlFor="starting-bid">Starting Bid ($)</Label>
                <Input
                  id="starting-bid"
                  type="number"
                  placeholder="100"
                  value={newItem.startingBid}
                  onChange={(e) => setNewItem({ ...newItem, startingBid: e.target.value })}
                  data-testid="input-starting-bid"
                />
              </div>
              <Button
                onClick={addItem}
                className="w-full"
                variant="outline"
                data-testid="button-add-item"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <ScrollArea className="h-[300px] border rounded-lg p-2">
              <div className="space-y-2">
                {inventory.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border flex items-center gap-2 ${
                      index === currentItemIndex && isLive ? "bg-accent/20 border-accent" : ""
                    }`}
                    data-testid={`inventory-item-${item.id}`}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">${item.startingBid}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Center: Current Item & Controls */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Auction Control</CardTitle>
                <CardDescription>Manage your live auction session</CardDescription>
              </div>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-[200px]" data-testid="select-facebook-group">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {mockGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      <div className="flex items-center gap-2">
                        <SiFacebook className="h-4 w-4" />
                        <span>{group.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Session Settings */}
            {!isLive && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="bid-increment">Bid Increment ($)</Label>
                  <Input
                    id="bid-increment"
                    type="number"
                    value={sessionSettings.bidIncrement}
                    onChange={(e) =>
                      setSessionSettings({ ...sessionSettings, bidIncrement: e.target.value })
                    }
                    data-testid="input-bid-increment"
                  />
                </div>
                <div>
                  <Label htmlFor="item-duration">Item Duration (min)</Label>
                  <Input
                    id="item-duration"
                    type="number"
                    value={sessionSettings.itemDuration}
                    onChange={(e) =>
                      setSessionSettings({ ...sessionSettings, itemDuration: e.target.value })
                    }
                    data-testid="input-item-duration"
                  />
                </div>
              </div>
            )}

            {/* Current Item Display */}
            {currentItem && isLive && (
              <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border-2 border-accent/50">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-accent text-accent-foreground">
                    Item {currentItemIndex + 1} of {inventory.length}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {sessionSettings.itemDuration}:00 remaining
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2" data-testid="text-current-item">
                  {currentItem.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground">Current Bid:</span>
                  <span className="text-3xl font-bold text-success tabular-nums" data-testid="text-current-bid">
                    ${currentItem.startingBid}
                  </span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3">
              <Button
                onClick={toggleLive}
                className="flex-1 h-12"
                variant={isLive ? "destructive" : "default"}
                data-testid="button-toggle-live"
              >
                {isLive ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause Auction
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start Live Auction
                  </>
                )}
              </Button>
              {isLive && (
                <Button
                  onClick={nextItem}
                  disabled={currentItemIndex >= inventory.length - 1}
                  className="h-12"
                  data-testid="button-next-item"
                >
                  <SkipForward className="h-5 w-5 mr-2" />
                  Next Item
                </Button>
              )}
            </div>

            {/* Session Stats */}
            {isLive && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Total Bids</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{currentItemIndex + 1}</p>
                  <p className="text-xs text-muted-foreground">Items Sold</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">15:32</p>
                  <p className="text-xs text-muted-foreground">Session Time</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
