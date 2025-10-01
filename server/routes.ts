import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import passport from "./auth";
import { storage } from "./storage";
import { insertUserSchema, insertAuctionSchema, insertBidSchema, insertFacebookGroupSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  let httpServer: any; // Will be set later to access broadcast functions

  // Facebook OAuth routes
  app.get("/api/auth/facebook", passport.authenticate("facebook", {
    scope: ["email", "public_profile", "user_managed_groups"]
  }));

  app.get("/api/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login?error=facebook_auth_failed" }),
    (req, res) => {
      // Successful authentication, redirect to dashboard
      const clientUrl = process.env.NODE_ENV === 'production'
        ? "https://auction-client.onrender.com/dashboard"
        : "/dashboard";
      res.redirect(clientUrl);
    }
  );

  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // Traditional authentication routes (keep for backward compatibility)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // In a real app, you'd use proper session management
      res.json({ user: { id: user.id, username: user.username, name: user.name } });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      res.status(201).json({ user: { id: user.id, username: user.username, name: user.name } });
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Auction routes
  app.get("/api/auctions", async (req, res) => {
    try {
      const { userId, status, limit } = req.query;
      const auctions = await storage.getAuctions({
        userId: userId as string,
        status: status as string,
        limit: limit ? parseInt(limit as string) : undefined
      });
      res.json(auctions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/auctions/:id", async (req, res) => {
    try {
      const auction = await storage.getAuction(req.params.id);
      if (!auction) {
        return res.status(404).json({ error: "Auction not found" });
      }
      res.json(auction);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auctions", async (req, res) => {
    try {
      const auctionData = insertAuctionSchema.parse(req.body);
      const auction = await storage.createAuction(auctionData);
      res.status(201).json(auction);
    } catch (error) {
      res.status(400).json({ error: "Invalid auction data" });
    }
  });

  app.put("/api/auctions/:id", async (req, res) => {
    try {
      const auction = await storage.updateAuction(req.params.id, req.body);
      if (!auction) {
        return res.status(404).json({ error: "Auction not found" });
      }
      res.json(auction);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/auctions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAuction(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Auction not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Bid routes
  app.get("/api/auctions/:auctionId/bids", async (req, res) => {
    try {
      const bids = await storage.getBidsForAuction(req.params.auctionId);
      res.json(bids);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/bids", async (req, res) => {
    try {
      const bidData = insertBidSchema.parse(req.body);

      // Validate bid amount
      const auction = await storage.getAuction(bidData.auctionId);
      if (!auction) {
        return res.status(404).json({ error: "Auction not found" });
      }

      const minBid = parseFloat(auction.currentBid) + parseFloat(auction.minIncrement);
      if (parseFloat(bidData.amount) < minBid) {
        return res.status(400).json({ error: `Bid must be at least $${minBid}` });
      }

      const bid = await storage.createBid(bidData);

      // Broadcast new bid via WebSocket
      if (httpServer && (httpServer as any).broadcastNewBid) {
        (httpServer as any).broadcastNewBid(bidData.auctionId, bid);
      }

      res.status(201).json(bid);
    } catch (error) {
      res.status(400).json({ error: "Invalid bid data" });
    }
  });

  app.get("/api/users/:userId/bids", async (req, res) => {
    try {
      const bids = await storage.getBidsForUser(req.params.userId);
      res.json(bids);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Facebook Group routes
  app.get("/api/users/:userId/facebook-groups", async (req, res) => {
    try {
      const groups = await storage.getFacebookGroupsForUser(req.params.userId);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/facebook-groups", async (req, res) => {
    try {
      const groupData = insertFacebookGroupSchema.parse(req.body);
      const group = await storage.createFacebookGroup(groupData);
      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ error: "Invalid group data" });
    }
  });

  // Live Feed Session routes
  app.get("/api/users/:userId/live-feed-sessions", async (req, res) => {
    try {
      const sessions = await storage.getLiveFeedSessionsForUser(req.params.userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/live-feed-sessions/:id", async (req, res) => {
    try {
      const session = await storage.getLiveFeedSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/live-feed-sessions", async (req, res) => {
    try {
      const session = await storage.createLiveFeedSession(req.body);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.put("/api/live-feed-sessions/:id", async (req, res) => {
    try {
      const session = await storage.updateLiveFeedSession(req.params.id, req.body);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Live Feed Item routes
  app.get("/api/live-feed-sessions/:sessionId/items", async (req, res) => {
    try {
      const items = await storage.getLiveFeedItemsForSession(req.params.sessionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/live-feed-items", async (req, res) => {
    try {
      const item = await storage.createLiveFeedItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid item data" });
    }
  });

  app.put("/api/live-feed-items/:id", async (req, res) => {
    try {
      const item = await storage.updateLiveFeedItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User Settings routes
  app.get("/api/users/:userId/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings(req.params.userId);
      if (!settings) {
        // Create default settings if none exist
        const defaultSettings = await storage.createUserSettings({
          userId: req.params.userId,
          outbidNotifications: true,
          endingNotifications: true,
          newBidNotifications: true,
          defaultMinIncrement: "10.00",
          defaultDuration: 24
        });
        return res.json(defaultSettings);
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/users/:userId/settings", async (req, res) => {
    try {
      const settings = await storage.updateUserSettings(req.params.userId, req.body);
      if (!settings) {
        return res.status(404).json({ error: "Settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Dashboard stats route
  app.get("/api/users/:userId/dashboard-stats", async (req, res) => {
    try {
      const auctions = await storage.getAuctions({ userId: req.params.userId });
      const userBids = await storage.getBidsForUser(req.params.userId);

      const activeAuctions = auctions.filter(a => a.status === "live" || a.status === "ending-soon").length;
      const totalBidsToday = userBids.filter(b => {
        const today = new Date();
        const bidDate = new Date(b.createdAt);
        return bidDate.toDateString() === today.toDateString();
      }).length;

      const highestBid = Math.max(...auctions.map(a => parseFloat(a.currentBid)), 0);
      const endingSoon = auctions.filter(a => {
        const now = new Date();
        const endTime = new Date(a.endTime);
        const diff = endTime.getTime() - now.getTime();
        return diff > 0 && diff < 3600000; // Less than 1 hour
      }).length;

      res.json({
        activeAuctions,
        totalBidsToday,
        highestCurrentBid: `$${highestBid.toLocaleString()}`,
        endingInOneHour: endingSoon
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  httpServer = createServer(app);

  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer });

  // Store WebSocket connections by auction ID
  const auctionConnections = new Map<string, Set<any>>();

  wss.on("connection", (ws, req) => {
    console.log("WebSocket connection established");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "subscribe" && data.auctionId) {
          // Subscribe to auction updates
          if (!auctionConnections.has(data.auctionId)) {
            auctionConnections.set(data.auctionId, new Set());
          }
          auctionConnections.get(data.auctionId)!.add(ws);

          ws.send(JSON.stringify({
            type: "subscribed",
            auctionId: data.auctionId
          }));
        }

        if (data.type === "unsubscribe" && data.auctionId) {
          // Unsubscribe from auction updates
          const connections = auctionConnections.get(data.auctionId);
          if (connections) {
            connections.delete(ws);
            if (connections.size === 0) {
              auctionConnections.delete(data.auctionId);
            }
          }
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      // Remove connection from all auction subscriptions
      auctionConnections.forEach((connections, auctionId) => {
        connections.delete(ws);
        if (connections.size === 0) {
          auctionConnections.delete(auctionId);
        }
      });
    });
  });

  // Function to broadcast auction updates
  const broadcastAuctionUpdate = (auctionId: string, data: any) => {
    const connections = auctionConnections.get(auctionId);
    if (connections) {
      const message = JSON.stringify({
        type: "auction_update",
        auctionId,
        data
      });

      connections.forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(message);
        }
      });
    }
  };

  // Function to broadcast new bids
  const broadcastNewBid = (auctionId: string, bid: any) => {
    const connections = auctionConnections.get(auctionId);
    if (connections) {
      const message = JSON.stringify({
        type: "new_bid",
        auctionId,
        bid
      });

      connections.forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(message);
        }
      });
    }
  };

  // Store broadcast functions on the server for use in routes
  (httpServer as any).broadcastAuctionUpdate = broadcastAuctionUpdate;
  (httpServer as any).broadcastNewBid = broadcastNewBid;

  return httpServer;
}
