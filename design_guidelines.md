# Design Guidelines: Facebook Auction Management Platform (Consumer Edition)

## Design Approach

**Reference-Based Approach**: Facebook Marketplace simplicity + Shopify's approachable admin + eBay's auction DNA

**Core Principle**: Friendly, confidence-inspiring interface that makes auction hosting feel effortless for everyday Facebook users. Prioritize clarity over data density, with clear visual feedback for live auction states.

## Color Palette

**Dark Mode (Primary)**
- Background: 220 18% 10% (warm charcoal)
- Surface: 220 16% 14% (elevated cards)
- Surface Elevated: 220 14% 18% (modal/active states)
- Border: 220 10% 28%
- Text Primary: 0 0% 98%
- Text Secondary: 0 0% 68%

**Brand & Accent Colors**
- Primary: 221 83% 53% (Facebook-inspired blue for trust/familiarity)
- Success: 142 76% 45% (winning bid, live status)
- Warning: 38 92% 50% (ending soon, attention needed)
- Accent: 280 65% 60% (Live Feed mode indicator, purple for energy)
- Facebook Brand: 221 44% 41% (for Facebook login/integration elements)

## Typography

**Font Family**: Inter (Google Fonts) - friendly, highly legible
- Display/Hero: 700 weight, -0.02em tracking
- Section Headers: 600 weight
- Body: 400-500 weight
- Auction Titles: 600 weight, slightly condensed
- Bid Amounts: 600 weight, tabular-nums

**Type Scale**
- Hero: text-4xl md:text-5xl font-bold
- Page Titles: text-2xl md:text-3xl font-semibold
- Card Headers: text-xl font-semibold
- Body: text-base
- Meta/Labels: text-sm text-secondary
- Timestamps: text-xs text-secondary

## Layout System

**Spacing Primitives**: Tailwind units of 3, 4, 6, 8, 12, 16, 20
- Card padding: p-6 md:p-8
- Section gaps: space-y-8 md:space-y-12
- Component spacing: gap-4 to gap-6
- Form fields: space-y-4

**Container Strategy**
- Main app: max-w-7xl with responsive sidebar (hidden on mobile, drawer)
- Auction grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Create auction flow: max-w-3xl
- Live Feed interface: max-w-6xl with sidebar for inventory

## Component Library

### Facebook Authentication
- Prominent "Continue with Facebook" button (Facebook blue with white text)
- Avatar + name display in top-right corner
- Connected groups selector (dropdown with Facebook group icons)

### Navigation & Layout
- Top bar: Logo + "Create Auction" CTA + User menu
- Mobile: Bottom navigation with "Home", "Create", "My Auctions", "Profile"
- Desktop sidebar: Dashboard, Create Auction, Active Auctions, Auction History, Settings

### Auction Type Cards (Selection Screen)
Large, welcoming cards (h-48) for choosing auction type:
- **Individual Post Auction**: Icon of single item, "Simple & Quick" badge, description: "Post one auction directly to your group"
- **Live Feed Auction**: Icon of multiple items, "Pro Feature" badge, description: "Host live auctions with inventory management"
- Hover lift effect, gradient backgrounds (blue-to-purple subtle gradients)

### Individual Post Auction Form
- Facebook Group selector with group thumbnails
- Auction item name input (large, prominent)
- Description textarea with character count
- Starting bid input with currency symbol
- Date/time picker (start & end) with friendly calendar
- Image upload area (drag-drop, multi-image support with preview grid)
- "Post to Facebook" primary button (Facebook blue)

### Live Feed Auction Interface
Split layout (lg:grid-cols-3):
- **Left Sidebar (Inventory)**: Draggable item list, "Add Item" button, item cards with thumbnail, name, starting bid
- **Center (Active Item)**: Large item display, current bid (huge typography), countdown timer, bid input with quick increment buttons (+$5, +$10), recent bids stream
- **Right Panel (Controls)**: "Start Auction" / "Pause" / "Next Item" buttons, session stats (items sold, total bids, session time)

### Auction Status Cards (Grid View)
Rounded cards with:
- Item image with status badge overlay ("Live" with pulse animation, "Ending Soon" with clock icon)
- Auction title (truncated elegantly)
- Current bid (large, colored by status - green for active, gray for ended)
- Bid count bubble, time remaining with icon
- Facebook group badge (small group avatar)
- CTA: "View Auction" or "Manage"

### Live Feed Controls
Floating control bar (sticky bottom on mobile, sidebar on desktop):
- Large toggle: "🔴 Live" / "⏸️ Paused" with color transitions
- Session timer display
- "Next Item" button (disabled when paused)
- "End Session" with confirmation modal

### Bid Activity Feed
Real-time list component:
- Avatar + bidder name (if available, else "Facebook User")
- Bid amount (bold, color-coded if outbid/leading)
- Timestamp (relative: "2m ago")
- Scroll-to-top on new bid with subtle highlight animation

### Empty States
Friendly illustrations with clear CTAs:
- "No auctions yet": Illustration of gavel + "Create your first auction" button
- "No active bids": Illustration of waiting + "Share your auction link"
- Warm, encouraging copy throughout

## Images

**Hero Section (Dashboard)**: Full-width banner (h-80) with vibrant auction scene
- Suggested image: People at lively auction/marketplace with smartphones, overlaid with gradient (from 221 83% 53% at 20% opacity to background)
- Hero text: "Host Auctions Right in Your Facebook Groups" with subtitle

**Auction Cards**: Square aspect ratio (aspect-square) for auction items
- High-quality product photos when available
- Gradient placeholder with item initial when no image (purple-to-blue gradient)

**Feature Highlights**: Illustration-style graphics for "How it Works" section
- Step 1: Facebook login illustration
- Step 2: Create auction illustration
- Step 3: Live bidding illustration

## Interaction Patterns

- **Smooth Transitions**: Button hovers (scale-105), card lifts (translate-y-2), all with transition-all duration-200
- **Real-time Feedback**: Pulse animation on new bids, color transitions on status changes, confetti animation on auction end
- **Loading States**: Skeleton loaders for auction grids, spinner for post-to-Facebook actions
- **Micro-interactions**: Heart animation when favoriting, checkmark animation on successful post
- **Toast Notifications**: Bottom-center on mobile, top-right on desktop for bid updates, auction posted confirmations

## Accessibility & Responsive

- Mobile-first with touch-optimized controls (min 44px tap targets)
- High contrast mode support for bid amounts and CTAs
- Clear focus rings with primary color
- Form validation with friendly error messages and icons
- Responsive typography scaling (clamp() for fluid sizing)

## Key Differentiators

- **Facebook-Native Feel**: Visual consistency with Facebook's design language for familiarity
- **Two-Mode Design**: Simple mode (Individual) vs. Pro mode (Live Feed) with clear visual distinction
- **Welcoming Onboarding**: Tutorial overlays, success celebrations, encouraging empty states
- **Live Auction Energy**: Pulse animations, real-time updates, vibrant status indicators create excitement
- **Mobile-Optimized**: Bottom navigation, thumb-friendly controls, simplified Live Feed on mobile