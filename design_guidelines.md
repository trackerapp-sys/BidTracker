# Design Guidelines: Facebook Group Auction Management Platform

## Design Approach

**Hybrid Approach**: Clean design system foundation (Linear/Notion-inspired) + Auction platform references (eBay, Bring a Trailer)

**Core Principle**: Professional, data-dense interface that conveys trust and efficiency while making real-time auction activity immediately visible.

## Color Palette

**Dark Mode (Primary)**
- Background: 222 15% 8% (deep charcoal)
- Surface: 222 15% 12% (elevated cards)
- Surface Elevated: 222 15% 16% (modal/active states)
- Border: 222 10% 25%
- Text Primary: 0 0% 98%
- Text Secondary: 0 0% 65%

**Brand & Accent Colors**
- Primary: 217 91% 60% (trustworthy blue - auction platform standard)
- Success: 142 71% 45% (winning bid indicator)
- Warning: 38 92% 50% (ending soon alerts)
- Danger: 0 84% 60% (outbid notifications)

## Typography

**Font System**: Inter (Google Fonts)
- Headings: 600-700 weight, tight tracking
- Body: 400-500 weight
- Data/Numbers: 500-600 weight (tabular-nums for bid amounts)

**Scale**
- Hero/Dashboard Title: text-3xl md:text-4xl font-bold
- Section Headers: text-xl md:text-2xl font-semibold
- Card Titles: text-lg font-semibold
- Body: text-base
- Small/Meta: text-sm text-secondary
- Micro (timestamps): text-xs

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6 to p-8
- Section spacing: space-y-8 to space-y-12
- Card gaps: gap-6
- Form field spacing: space-y-4

**Container Strategy**
- Main dashboard: max-w-7xl with grid-cols-1 lg:grid-cols-3 (sidebar + main)
- Auction feed: max-w-6xl
- Forms: max-w-2xl
- Data tables: full-width within container

## Component Library

### Navigation
- Top navigation bar with app logo, quick stats, user menu
- Sidebar for admin (Dashboard, Active Auctions, Create Auction, Bid History, Settings)
- Sticky positioning for real-time updates visibility

### Auction Cards
- Elevated cards (surface elevated background) with hover lift effect
- Card structure: Featured image placeholder, Auction title, Facebook post URL (truncated with icon), Current bid (large, prominent), Time remaining (countdown with color coding), Bid count, "Place Bid" CTA
- Active auction indicator: subtle left border in primary color

### Live Auction Feed
- Masonry-style grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Real-time badge for auctions with recent activity
- Status badges: "Live", "Ending Soon", "Hot" (multiple bids in last 5min)

### Forms (Create Auction)
- Clean, spacious layout with clear field labels
- Facebook Post URL input with validation icon
- Date/time pickers for auction start/end
- Starting bid input with currency formatting
- Image upload with preview (auction item)
- "Publish Auction" primary button

### Bid Submission Interface
- Modal overlay with auction details recap
- Current highest bid displayed prominently
- Bid input with minimum increment validation
- Bid history list (last 5 bids with timestamps)
- Confirm bid button with loading state

### Data Displays
- Tables for bid history: Striped rows, sticky header, sortable columns
- Auction status indicators: Color-coded chips (Live=blue, Ended=gray, Cancelled=red)
- Countdown timers: Dynamic updates with color transitions (green > yellow > red)

### Dashboard Statistics
- Metric cards in grid: Total Active Auctions, Total Bids Today, Highest Current Bid, Ending in <1 Hour
- Large numbers with descriptive labels
- Trend indicators (up/down arrows with percentages)

## Images

**Hero Section**: Full-width banner (h-64) with gradient overlay
- Image suggestion: Auction gavel or crowd bidding scene with blue gradient overlay (from transparent to background color)
- Overlay text: "Manage Facebook Group Auctions with Precision"

**Auction Cards**: Square thumbnails (aspect-square) for auction items
- Placeholder if no image: Icon-based placeholder with gradient background

**Empty States**: Illustration-style graphics for "No active auctions" or "No bids yet"

## Interaction Patterns

- Minimal animations: Hover lift on cards (translate-y-1), button scale on click
- Loading states: Spinner for async operations, skeleton loaders for auction feed
- Real-time updates: Subtle pulse animation on new bid notifications
- Toast notifications: Top-right corner for bid confirmations, outbid alerts

## Accessibility & Responsive

- Desktop-first with comprehensive mobile breakpoints
- All form inputs with dark mode-friendly backgrounds (surface color)
- High contrast for bid amounts and CTAs
- Touch-friendly targets on mobile (min-h-12)
- Clear focus indicators on all interactive elements

## Key Differentiators

- **Professional Dashboard Aesthetic**: Clean, data-focused like Linear
- **Real-time Urgency Indicators**: Color-coded countdowns and bid activity
- **Trust Signals**: Facebook URL integration, verified auction status
- **Auction Platform DNA**: Card layouts inspired by eBay with modern execution