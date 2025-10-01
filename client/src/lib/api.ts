import { apiRequest } from "./queryClient";
import type { 
  User, Auction, Bid, FacebookGroup, 
  LiveFeedSession, LiveFeedItem, UserSettings 
} from "@shared/schema";

// Auth API
export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    return response.json();
  },

  register: async (userData: { username: string; password: string; name?: string; email?: string }) => {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    return response.json();
  },
};

// User API
export const userApi = {
  getUser: async (id: string): Promise<User> => {
    const response = await apiRequest("GET", `/api/users/${id}`);
    return response.json();
  },

  getDashboardStats: async (userId: string) => {
    const response = await apiRequest("GET", `/api/users/${userId}/dashboard-stats`);
    return response.json();
  },

  getBids: async (userId: string): Promise<Bid[]> => {
    const response = await apiRequest("GET", `/api/users/${userId}/bids`);
    return response.json();
  },

  getSettings: async (userId: string): Promise<UserSettings> => {
    const response = await apiRequest("GET", `/api/users/${userId}/settings`);
    return response.json();
  },

  updateSettings: async (userId: string, settings: Partial<UserSettings>): Promise<UserSettings> => {
    const response = await apiRequest("PUT", `/api/users/${userId}/settings`, settings);
    return response.json();
  },
};

// Auction API
export const auctionApi = {
  getAuctions: async (filters?: { userId?: string; status?: string; limit?: number }): Promise<Auction[]> => {
    const params = new URLSearchParams();
    if (filters?.userId) params.append("userId", filters.userId);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.limit) params.append("limit", filters.limit.toString());
    
    const response = await apiRequest("GET", `/api/auctions?${params.toString()}`);
    return response.json();
  },

  getAuction: async (id: string): Promise<Auction> => {
    const response = await apiRequest("GET", `/api/auctions/${id}`);
    return response.json();
  },

  createAuction: async (auction: {
    title: string;
    description?: string;
    facebookUrl?: string;
    startingBid: string;
    minIncrement: string;
    startTime: string;
    endTime: string;
    userId: string;
    facebookGroupId?: string;
    imageUrls?: string[];
    isLiveFeed?: boolean;
  }): Promise<Auction> => {
    const response = await apiRequest("POST", "/api/auctions", auction);
    return response.json();
  },

  updateAuction: async (id: string, updates: Partial<Auction>): Promise<Auction> => {
    const response = await apiRequest("PUT", `/api/auctions/${id}`, updates);
    return response.json();
  },

  deleteAuction: async (id: string): Promise<void> => {
    await apiRequest("DELETE", `/api/auctions/${id}`);
  },

  getBids: async (auctionId: string): Promise<Bid[]> => {
    const response = await apiRequest("GET", `/api/auctions/${auctionId}/bids`);
    return response.json();
  },
};

// Bid API
export const bidApi = {
  createBid: async (bid: {
    amount: string;
    bidder: string;
    bidderFacebookId?: string;
    auctionId: string;
    userId?: string;
  }): Promise<Bid> => {
    const response = await apiRequest("POST", "/api/bids", bid);
    return response.json();
  },
};

// Facebook Group API
export const facebookGroupApi = {
  getUserGroups: async (userId: string): Promise<FacebookGroup[]> => {
    const response = await apiRequest("GET", `/api/users/${userId}/facebook-groups`);
    return response.json();
  },

  createGroup: async (group: {
    facebookGroupId: string;
    name: string;
    memberCount?: number;
    userId: string;
  }): Promise<FacebookGroup> => {
    const response = await apiRequest("POST", "/api/facebook-groups", group);
    return response.json();
  },
};

// Live Feed API
export const liveFeedApi = {
  getSessions: async (userId: string): Promise<LiveFeedSession[]> => {
    const response = await apiRequest("GET", `/api/users/${userId}/live-feed-sessions`);
    return response.json();
  },

  getSession: async (id: string): Promise<LiveFeedSession> => {
    const response = await apiRequest("GET", `/api/live-feed-sessions/${id}`);
    return response.json();
  },

  createSession: async (session: {
    name: string;
    userId: string;
    facebookGroupId?: string;
    bidIncrement?: string;
    itemDuration?: number;
  }): Promise<LiveFeedSession> => {
    const response = await apiRequest("POST", "/api/live-feed-sessions", session);
    return response.json();
  },

  updateSession: async (id: string, updates: Partial<LiveFeedSession>): Promise<LiveFeedSession> => {
    const response = await apiRequest("PUT", `/api/live-feed-sessions/${id}`, updates);
    return response.json();
  },

  getItems: async (sessionId: string): Promise<LiveFeedItem[]> => {
    const response = await apiRequest("GET", `/api/live-feed-sessions/${sessionId}/items`);
    return response.json();
  },

  createItem: async (item: {
    name: string;
    description?: string;
    startingBid: string;
    sessionId: string;
    orderIndex: number;
    imageUrls?: string[];
  }): Promise<LiveFeedItem> => {
    const response = await apiRequest("POST", "/api/live-feed-items", item);
    return response.json();
  },

  updateItem: async (id: string, updates: Partial<LiveFeedItem>): Promise<LiveFeedItem> => {
    const response = await apiRequest("PUT", `/api/live-feed-items/${id}`, updates);
    return response.json();
  },
};
