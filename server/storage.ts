import {
  type User, type InsertUser,
  type Auction, type InsertAuction,
  type Bid, type InsertBid,
  type FacebookGroup, type InsertFacebookGroup,
  type LiveFeedSession, type InsertLiveFeedSession,
  type LiveFeedItem, type InsertLiveFeedItem,
  type UserSettings, type InsertUserSettings
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByFacebookId(facebookId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Auction operations
  getAuction(id: string): Promise<Auction | undefined>;
  getAuctions(filters?: { userId?: string; status?: string; limit?: number }): Promise<Auction[]>;
  createAuction(auction: InsertAuction): Promise<Auction>;
  updateAuction(id: string, updates: Partial<Auction>): Promise<Auction | undefined>;
  deleteAuction(id: string): Promise<boolean>;

  // Bid operations
  getBid(id: string): Promise<Bid | undefined>;
  getBidsForAuction(auctionId: string): Promise<Bid[]>;
  getBidsForUser(userId: string): Promise<Bid[]>;
  createBid(bid: InsertBid): Promise<Bid>;
  updateBid(id: string, updates: Partial<Bid>): Promise<Bid | undefined>;

  // Facebook Group operations
  getFacebookGroup(id: string): Promise<FacebookGroup | undefined>;
  getFacebookGroupsForUser(userId: string): Promise<FacebookGroup[]>;
  createFacebookGroup(group: InsertFacebookGroup): Promise<FacebookGroup>;
  updateFacebookGroup(id: string, updates: Partial<FacebookGroup>): Promise<FacebookGroup | undefined>;
  deleteFacebookGroup(id: string): Promise<boolean>;

  // Live Feed Session operations
  getLiveFeedSession(id: string): Promise<LiveFeedSession | undefined>;
  getLiveFeedSessionsForUser(userId: string): Promise<LiveFeedSession[]>;
  createLiveFeedSession(session: InsertLiveFeedSession): Promise<LiveFeedSession>;
  updateLiveFeedSession(id: string, updates: Partial<LiveFeedSession>): Promise<LiveFeedSession | undefined>;
  deleteLiveFeedSession(id: string): Promise<boolean>;

  // Live Feed Item operations
  getLiveFeedItem(id: string): Promise<LiveFeedItem | undefined>;
  getLiveFeedItemsForSession(sessionId: string): Promise<LiveFeedItem[]>;
  createLiveFeedItem(item: InsertLiveFeedItem): Promise<LiveFeedItem>;
  updateLiveFeedItem(id: string, updates: Partial<LiveFeedItem>): Promise<LiveFeedItem | undefined>;
  deleteLiveFeedItem(id: string): Promise<boolean>;

  // User Settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private auctions: Map<string, Auction>;
  private bids: Map<string, Bid>;
  private facebookGroups: Map<string, FacebookGroup>;
  private liveFeedSessions: Map<string, LiveFeedSession>;
  private liveFeedItems: Map<string, LiveFeedItem>;
  private userSettings: Map<string, UserSettings>;

  constructor() {
    this.users = new Map();
    this.auctions = new Map();
    this.bids = new Map();
    this.facebookGroups = new Map();
    this.liveFeedSessions = new Map();
    this.liveFeedItems = new Map();
    this.userSettings = new Map();

    // Initialize with sample data for testing
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample user
    const sampleUser = await this.createUser({
      username: "demo",
      password: "demo123",
      name: "Demo User",
      email: "demo@example.com"
    });

    // Create sample Facebook group
    const sampleGroup = await this.createFacebookGroup({
      facebookGroupId: "123456789",
      name: "Vintage Car Enthusiasts",
      memberCount: 2300,
      userId: sampleUser.id
    });

    // Create sample auctions
    const auction1 = await this.createAuction({
      title: "Vintage 1967 Ford Mustang Fastback - Original Parts",
      description: "Beautiful classic car in excellent condition",
      facebookUrl: "https://facebook.com/groups/123456/permalink/789012345/",
      startingBid: "1000.00",
      minIncrement: "50.00",
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      userId: sampleUser.id,
      facebookGroupId: sampleGroup.id,
      isLiveFeed: false
    });

    const auction2 = await this.createAuction({
      title: "Antique Victorian Dining Chair Set (6 pieces)",
      description: "Rare antique dining set from the Victorian era",
      facebookUrl: "https://facebook.com/groups/123456/permalink/789012346/",
      startingBid: "500.00",
      minIncrement: "25.00",
      startTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 30 * 60 * 1000),
      userId: sampleUser.id,
      facebookGroupId: sampleGroup.id,
      isLiveFeed: false
    });

    // Update auction statuses
    await this.updateAuction(auction1.id, { status: "live" });
    await this.updateAuction(auction2.id, { status: "ending-soon" });

    // Create sample bids
    await this.createBid({
      amount: "2450.00",
      bidder: "John D.",
      auctionId: auction1.id,
      userId: sampleUser.id
    });

    await this.createBid({
      amount: "850.00",
      bidder: "Sarah M.",
      auctionId: auction2.id,
      userId: sampleUser.id
    });

    // Create user settings
    await this.createUserSettings({
      userId: sampleUser.id,
      outbidNotifications: true,
      endingNotifications: true,
      newBidNotifications: true,
      defaultMinIncrement: "10.00",
      defaultDuration: 24
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByFacebookId(facebookId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.facebookId === facebookId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      name: insertUser.name || null,
      email: insertUser.email || null,
      facebookId: insertUser.facebookId || null,
      facebookAccessToken: null,
      avatar: null,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Auction operations
  async getAuction(id: string): Promise<Auction | undefined> {
    return this.auctions.get(id);
  }

  async getAuctions(filters?: { userId?: string; status?: string; limit?: number }): Promise<Auction[]> {
    let auctions = Array.from(this.auctions.values());

    if (filters?.userId) {
      auctions = auctions.filter(a => a.userId === filters.userId);
    }

    if (filters?.status) {
      auctions = auctions.filter(a => a.status === filters.status);
    }

    // Sort by creation date, newest first
    auctions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (filters?.limit) {
      auctions = auctions.slice(0, filters.limit);
    }

    return auctions;
  }

  async createAuction(insertAuction: InsertAuction): Promise<Auction> {
    const id = randomUUID();
    const now = new Date();
    const auction: Auction = {
      ...insertAuction,
      id,
      description: insertAuction.description || null,
      facebookUrl: insertAuction.facebookUrl || null,
      facebookGroupId: insertAuction.facebookGroupId || null,
      imageUrls: insertAuction.imageUrls || null,
      isLiveFeed: insertAuction.isLiveFeed || false,
      currentBid: insertAuction.startingBid,
      bidCount: 0,
      status: "draft",
      facebookPostId: null,
      createdAt: now,
      updatedAt: now
    };
    this.auctions.set(id, auction);
    return auction;
  }

  async updateAuction(id: string, updates: Partial<Auction>): Promise<Auction | undefined> {
    const auction = this.auctions.get(id);
    if (!auction) return undefined;

    const updatedAuction = {
      ...auction,
      ...updates,
      updatedAt: new Date()
    };
    this.auctions.set(id, updatedAuction);
    return updatedAuction;
  }

  async deleteAuction(id: string): Promise<boolean> {
    return this.auctions.delete(id);
  }

  // Bid operations
  async getBid(id: string): Promise<Bid | undefined> {
    return this.bids.get(id);
  }

  async getBidsForAuction(auctionId: string): Promise<Bid[]> {
    return Array.from(this.bids.values())
      .filter(bid => bid.auctionId === auctionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBidsForUser(userId: string): Promise<Bid[]> {
    return Array.from(this.bids.values())
      .filter(bid => bid.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createBid(insertBid: InsertBid): Promise<Bid> {
    const id = randomUUID();
    const now = new Date();
    const bid: Bid = {
      ...insertBid,
      id,
      userId: insertBid.userId || null,
      bidderFacebookId: insertBid.bidderFacebookId || null,
      isWinning: false,
      createdAt: now
    };

    // Update auction with new bid
    const auction = this.auctions.get(insertBid.auctionId);
    if (auction) {
      // Mark all previous bids as not winning
      Array.from(this.bids.values())
        .filter(b => b.auctionId === insertBid.auctionId)
        .forEach(b => {
          this.bids.set(b.id, { ...b, isWinning: false });
        });

      // Mark this bid as winning
      bid.isWinning = true;

      // Update auction
      const updatedAuction = {
        ...auction,
        currentBid: insertBid.amount,
        bidCount: auction.bidCount + 1,
        updatedAt: new Date()
      };
      this.auctions.set(insertBid.auctionId, updatedAuction);
    }

    this.bids.set(id, bid);
    return bid;
  }

  async updateBid(id: string, updates: Partial<Bid>): Promise<Bid | undefined> {
    const bid = this.bids.get(id);
    if (!bid) return undefined;

    const updatedBid = { ...bid, ...updates };
    this.bids.set(id, updatedBid);
    return updatedBid;
  }

  // Facebook Group operations
  async getFacebookGroup(id: string): Promise<FacebookGroup | undefined> {
    return this.facebookGroups.get(id);
  }

  async getFacebookGroupsForUser(userId: string): Promise<FacebookGroup[]> {
    return Array.from(this.facebookGroups.values())
      .filter(group => group.userId === userId && group.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async createFacebookGroup(insertGroup: InsertFacebookGroup): Promise<FacebookGroup> {
    const id = randomUUID();
    const now = new Date();
    const group: FacebookGroup = {
      ...insertGroup,
      id,
      memberCount: insertGroup.memberCount || null,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
    this.facebookGroups.set(id, group);
    return group;
  }

  async updateFacebookGroup(id: string, updates: Partial<FacebookGroup>): Promise<FacebookGroup | undefined> {
    const group = this.facebookGroups.get(id);
    if (!group) return undefined;

    const updatedGroup = {
      ...group,
      ...updates,
      updatedAt: new Date()
    };
    this.facebookGroups.set(id, updatedGroup);
    return updatedGroup;
  }

  async deleteFacebookGroup(id: string): Promise<boolean> {
    return this.facebookGroups.delete(id);
  }

  // Live Feed Session operations
  async getLiveFeedSession(id: string): Promise<LiveFeedSession | undefined> {
    return this.liveFeedSessions.get(id);
  }

  async getLiveFeedSessionsForUser(userId: string): Promise<LiveFeedSession[]> {
    return Array.from(this.liveFeedSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createLiveFeedSession(insertSession: InsertLiveFeedSession): Promise<LiveFeedSession> {
    const id = randomUUID();
    const now = new Date();
    const session: LiveFeedSession = {
      ...insertSession,
      id,
      facebookGroupId: insertSession.facebookGroupId || null,
      bidIncrement: insertSession.bidIncrement || "10.00",
      itemDuration: insertSession.itemDuration || 60,
      isActive: false,
      currentItemIndex: 0,
      createdAt: now,
      updatedAt: now
    };
    this.liveFeedSessions.set(id, session);
    return session;
  }

  async updateLiveFeedSession(id: string, updates: Partial<LiveFeedSession>): Promise<LiveFeedSession | undefined> {
    const session = this.liveFeedSessions.get(id);
    if (!session) return undefined;

    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date()
    };
    this.liveFeedSessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteLiveFeedSession(id: string): Promise<boolean> {
    return this.liveFeedSessions.delete(id);
  }

  // Live Feed Item operations
  async getLiveFeedItem(id: string): Promise<LiveFeedItem | undefined> {
    return this.liveFeedItems.get(id);
  }

  async getLiveFeedItemsForSession(sessionId: string): Promise<LiveFeedItem[]> {
    return Array.from(this.liveFeedItems.values())
      .filter(item => item.sessionId === sessionId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async createLiveFeedItem(insertItem: InsertLiveFeedItem): Promise<LiveFeedItem> {
    const id = randomUUID();
    const now = new Date();
    const item: LiveFeedItem = {
      ...insertItem,
      id,
      currentBid: null,
      imageUrls: insertItem.imageUrls || null,
      description: insertItem.description || null,
      status: "pending",
      createdAt: now
    };
    this.liveFeedItems.set(id, item);
    return item;
  }

  async updateLiveFeedItem(id: string, updates: Partial<LiveFeedItem>): Promise<LiveFeedItem | undefined> {
    const item = this.liveFeedItems.get(id);
    if (!item) return undefined;

    const updatedItem = { ...item, ...updates };
    this.liveFeedItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteLiveFeedItem(id: string): Promise<boolean> {
    return this.liveFeedItems.delete(id);
  }

  // User Settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(
      settings => settings.userId === userId
    );
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = randomUUID();
    const now = new Date();
    const settings: UserSettings = {
      ...insertSettings,
      id,
      outbidNotifications: insertSettings.outbidNotifications ?? true,
      endingNotifications: insertSettings.endingNotifications ?? true,
      newBidNotifications: insertSettings.newBidNotifications ?? true,
      defaultMinIncrement: insertSettings.defaultMinIncrement || "10.00",
      defaultDuration: insertSettings.defaultDuration || 24,
      createdAt: now,
      updatedAt: now
    };
    this.userSettings.set(id, settings);
    return settings;
  }

  async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings | undefined> {
    const settings = Array.from(this.userSettings.values()).find(
      s => s.userId === userId
    );
    if (!settings) return undefined;

    const updatedSettings = {
      ...settings,
      ...updates,
      updatedAt: new Date()
    };
    this.userSettings.set(settings.id, updatedSettings);
    return updatedSettings;
  }
}

export const storage = new MemStorage();
