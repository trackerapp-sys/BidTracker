import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface WebSocketMessage {
  type: string;
  auctionId?: string;
  data?: any;
  bid?: any;
}

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const subscribedAuctions = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Create WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        switch (message.type) {
          case "subscribed":
            console.log(`Subscribed to auction ${message.auctionId}`);
            break;
            
          case "auction_update":
            if (message.auctionId && message.data) {
              // Invalidate auction queries to refetch updated data
              queryClient.invalidateQueries({ queryKey: ["auction", message.auctionId] });
              queryClient.invalidateQueries({ queryKey: ["auctions"] });
              queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            }
            break;
            
          case "new_bid":
            if (message.auctionId && message.bid) {
              // Invalidate bid and auction queries
              queryClient.invalidateQueries({ queryKey: ["auction-bids", message.auctionId] });
              queryClient.invalidateQueries({ queryKey: ["auction", message.auctionId] });
              queryClient.invalidateQueries({ queryKey: ["auctions"] });
              queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
              queryClient.invalidateQueries({ queryKey: ["user-bids"] });
              
              console.log(`New bid received for auction ${message.auctionId}:`, message.bid);
            }
            break;
            
          default:
            console.log("Unknown WebSocket message type:", message.type);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [queryClient]);

  const subscribeToAuction = (auctionId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && !subscribedAuctions.current.has(auctionId)) {
      wsRef.current.send(JSON.stringify({
        type: "subscribe",
        auctionId
      }));
      subscribedAuctions.current.add(auctionId);
    }
  };

  const unsubscribeFromAuction = (auctionId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && subscribedAuctions.current.has(auctionId)) {
      wsRef.current.send(JSON.stringify({
        type: "unsubscribe",
        auctionId
      }));
      subscribedAuctions.current.delete(auctionId);
    }
  };

  return {
    isConnected,
    subscribeToAuction,
    unsubscribeFromAuction
  };
};

// Hook for subscribing to a specific auction
export const useAuctionWebSocket = (auctionId: string | undefined) => {
  const { isConnected, subscribeToAuction, unsubscribeFromAuction } = useWebSocket();

  useEffect(() => {
    if (auctionId && isConnected) {
      subscribeToAuction(auctionId);
      
      return () => {
        unsubscribeFromAuction(auctionId);
      };
    }
  }, [auctionId, isConnected, subscribeToAuction, unsubscribeFromAuction]);

  return { isConnected };
};
