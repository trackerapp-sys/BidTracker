import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  facebookId: text("facebook_id").unique(),
  facebookAccessToken: text("facebook_access_token"),
  email: text("email"),
  name: text("name"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const facebookGroups = pgTable("facebook_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  facebookGroupId: text("facebook_group_id").notNull().unique(),
  name: text("name").notNull(),
  memberCount: integer("member_count"),
  userId: varchar("user_id").references(() => users.id).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const auctions = pgTable("auctions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  facebookUrl: text("facebook_url"),
  facebookPostId: text("facebook_post_id"),
  startingBid: decimal("starting_bid", { precision: 10, scale: 2 }).notNull(),
  currentBid: decimal("current_bid", { precision: 10, scale: 2 }).notNull(),
  minIncrement: decimal("min_increment", { precision: 10, scale: 2 }).notNull(),
  bidCount: integer("bid_count").default(0).notNull(),
  status: text("status", { enum: ["draft", "live", "ending-soon", "ended", "cancelled"] }).default("draft").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  facebookGroupId: varchar("facebook_group_id").references(() => facebookGroups.id),
  imageUrls: text("image_urls").array(),
  isLiveFeed: boolean("is_live_feed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bids = pgTable("bids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  bidder: text("bidder").notNull(),
  bidderFacebookId: text("bidder_facebook_id"),
  auctionId: varchar("auction_id").references(() => auctions.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  isWinning: boolean("is_winning").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const liveFeedSessions = pgTable("live_feed_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  facebookGroupId: varchar("facebook_group_id").references(() => facebookGroups.id),
  isActive: boolean("is_active").default(false).notNull(),
  currentItemIndex: integer("current_item_index").default(0).notNull(),
  bidIncrement: decimal("bid_increment", { precision: 10, scale: 2 }).default("5.00").notNull(),
  itemDuration: integer("item_duration").default(300).notNull(), // seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const liveFeedItems = pgTable("live_feed_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  startingBid: decimal("starting_bid", { precision: 10, scale: 2 }).notNull(),
  currentBid: decimal("current_bid", { precision: 10, scale: 2 }),
  sessionId: varchar("session_id").references(() => liveFeedSessions.id).notNull(),
  orderIndex: integer("order_index").notNull(),
  status: text("status", { enum: ["pending", "active", "sold", "passed"] }).default("pending").notNull(),
  imageUrls: text("image_urls").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  outbidNotifications: boolean("outbid_notifications").default(true).notNull(),
  endingNotifications: boolean("ending_notifications").default(true).notNull(),
  newBidNotifications: boolean("new_bid_notifications").default(true).notNull(),
  defaultMinIncrement: decimal("default_min_increment", { precision: 10, scale: 2 }).default("10.00").notNull(),
  defaultDuration: integer("default_duration").default(24).notNull(), // hours
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schema validation types
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  facebookId: true,
  email: true,
  name: true,
  avatar: true,
});

export const insertFacebookGroupSchema = createInsertSchema(facebookGroups).pick({
  facebookGroupId: true,
  name: true,
  memberCount: true,
  userId: true,
});

export const insertAuctionSchema = createInsertSchema(auctions).pick({
  title: true,
  description: true,
  facebookUrl: true,
  startingBid: true,
  minIncrement: true,
  startTime: true,
  endTime: true,
  userId: true,
  facebookGroupId: true,
  imageUrls: true,
  isLiveFeed: true,
});

export const insertBidSchema = createInsertSchema(bids).pick({
  amount: true,
  bidder: true,
  bidderFacebookId: true,
  auctionId: true,
  userId: true,
});

export const insertLiveFeedSessionSchema = createInsertSchema(liveFeedSessions).pick({
  name: true,
  userId: true,
  facebookGroupId: true,
  bidIncrement: true,
  itemDuration: true,
});

export const insertLiveFeedItemSchema = createInsertSchema(liveFeedItems).pick({
  name: true,
  description: true,
  startingBid: true,
  sessionId: true,
  orderIndex: true,
  imageUrls: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).pick({
  userId: true,
  outbidNotifications: true,
  endingNotifications: true,
  newBidNotifications: true,
  defaultMinIncrement: true,
  defaultDuration: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFacebookGroup = z.infer<typeof insertFacebookGroupSchema>;
export type FacebookGroup = typeof facebookGroups.$inferSelect;
export type InsertAuction = z.infer<typeof insertAuctionSchema>;
export type Auction = typeof auctions.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type Bid = typeof bids.$inferSelect;
export type InsertLiveFeedSession = z.infer<typeof insertLiveFeedSessionSchema>;
export type LiveFeedSession = typeof liveFeedSessions.$inferSelect;
export type InsertLiveFeedItem = z.infer<typeof insertLiveFeedItemSchema>;
export type LiveFeedItem = typeof liveFeedItems.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
