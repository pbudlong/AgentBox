# AgentBox - AI-Powered Meeting Qualification Platform

## Overview

AgentBox is a B2B SaaS platform that uses AI agents to automate sales meeting qualification. The system enables sellers and buyers to use dedicated @agentbox.ai email addresses where AI agents communicate on their behalf to:

- Qualify fit based on multiple signals (industry, company size, budget, timing, tech stack)
- Ask clarifying questions automatically
- Schedule meetings only when there's a strong match
- Reduce no-shows and unqualified meetings

Built as a Halloween hackathon project with a "hauntingly efficient" dark mode aesthetic, the application demonstrates agent-to-agent email conversations through a side-by-side demo viewer and provides comprehensive landing pages explaining the value proposition for both sellers and buyers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (no React Router dependency)

**UI Component System:**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Dark mode as default with theme toggle capability
- Design system based on "Linear's clean minimalism + Superhuman's email elegance" with Halloween aesthetic
- Custom spacing primitives (2, 4, 8, 12, 16, 20) and responsive grid layouts

**State Management:**
- TanStack Query (React Query) for server state management
- Local component state using React hooks
- Real-time updates through polling (2-3 second intervals planned)

**Key Page Structure:**
- 5-step demo flow: Cover → Use Case → Demo → Profiles → Tech Stack
- Progress indicator showing user's current position in the flow (clickable navigation)
- Cover page with centered logo and aligned tagline
- Use Case page with AgentBox logo in header space (absolute positioned)
- Side-by-side email client viewer for demonstrating agent conversations
- Side-by-side profile viewer showing seller and buyer data models
- Fit score visualization with signal indicators

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- ESM module system throughout
- Custom request logging middleware for API endpoints
- Static file serving for production builds

**API Design:**
- RESTful API structure (prefix: `/api`)
- Webhook endpoint pattern for inbound email processing (`POST /webhooks/agentmail`)
- Thread-based conversation endpoints (`/api/threads/:id`)
- JSON request/response format with error handling

**Storage Layer:**
- PostgreSQL database with Drizzle ORM (Neon serverless)
- Database connection in `server/db.ts` using drizzle-orm/neon-http
- Production-ready persistence for demo sessions
- Migration system via drizzle-kit (npm run db:push)

**Data Models:**
- `users`: User authentication (username, password)
- `demo_sessions`: Persist inbox IDs and exchange count across deployments
  - `sellerInboxId`, `sellerEmail`: Seller inbox details
  - `buyerInboxId`, `buyerEmail`: Buyer inbox details
  - `exchangeCount`: Tracks conversation progress (prevents infinite loops)
  - Enables webhooks to work in production by persisting state
- `SellerProfile` & `BuyerProfile`: Store user preferences (industry, company size, geo, budget, timing, tech stack)
- `ThreadState`: Track email conversation state, fit scores, missing information, and meeting details
- `Status` enum: collecting | approved | declined | scheduled
- Signal-based scoring system with configurable weights and thresholds

### Agent Intelligence System

**Fit Scoring Engine:**
- Multi-signal evaluation: industry_match, size_match, geo_match, need_intent, timing, budget, authority, stack_compatibility
- Weighted scoring algorithm (Σ weightᵢ × signalᵢ)
- Three-tier decision thresholds:
  - Below threshold_clarify: Polite decline
  - Between clarify and meet: Ask clarifying question
  - Above threshold_meet: Propose meeting times

**Conversation Flow:**
1. Inbound email triggers webhook
2. Load both parties' profiles
3. Extract signals from message content
4. Compute fit score
5. Generate appropriate response (decline/clarify/propose meeting)
6. Update thread state and notify participants

**Email Templates:**
- Structured responses for clarification requests
- Meeting proposal with time slot options
- Calendar integration formatting (ICS, Google Calendar links)
- Polite decline messages with resource sharing

### External Dependencies

**Active Third-Party Integrations:**
- **AgentMail**: Core email infrastructure for @agentmail.to addresses (API key configured via AGENTMAIL_API_KEY secret)
  - Live demo uses dynamically created inboxes (e.g., seller-1762148369969@agentmail.to)
  - API fields: `inboxId` (contains email address), `displayName`, `createdAt`, `updatedAt`
  - Inbox reuse logic handles AlreadyExistsError by calling listInboxes() and finding by inboxId
  - **Webhooks are configured at organization/pod level** - no per-inbox registration needed
  - Webhook URL: `https://{REPLIT_DOMAIN}/webhooks/agentmail` catches all messages for the pod
  - Once webhooks are registered for an organization, ALL inboxes inherit the configuration automatically
- **OpenAI / Mastra**: LLM-based agent intelligence (using AI_INTEGRATIONS_OPENAI_API_KEY from Replit integration)
  - Configured via createOpenAI({ apiKey }) at provider level
  - Powers buyer and seller agent responses with GPT-4
- **Perplexity**: Company research and enrichment (API key configured via PERPLEXITY_API_KEY secret)

**Current Dependencies:**
- **Neon Database**: PostgreSQL serverless database (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database operations and migrations
- **shadcn/ui + Radix UI**: Complete UI component ecosystem (20+ components)
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **React Query**: Data fetching and caching
- **Zod**: Runtime type validation with drizzle-zod integration

**Development Tools:**
- **Replit**: Hosting platform with integrated development environment
- **TypeScript**: Full type safety across client and server
- **esbuild**: Fast server-side bundling for production
- **tsx**: TypeScript execution for development server

### Design System

**Typography:**
- Primary: Inter or DM Sans via Google Fonts CDN
- Accent/Technical: Fira Code, Geist Mono for email addresses and code
- Hierarchical scale: 4xl-6xl headlines down to sm metadata text

**Color System:**
- CSS custom properties for theme colors (background, foreground, border, card, popover, primary, secondary, muted, accent)
- Gradient system (from/via/to) for visual effects
- Opacity-based elevation system for hover states (elevate-1, elevate-2)
- Dark mode optimized with subtle Halloween aesthetic

**Component Patterns:**
- Card-based layouts with hover elevation effects
- Badge system for status indicators
- Progress indicators for multi-step flows
- Responsive grid layouts (3-column features, 2-column comparisons)
- Fixed 2-column demo viewer (non-responsive side-by-side display)

## Live Demo Implementation

**Status:** ✅ Fully functional with real agent-to-agent email communication

**Flow:**
1. User clicks "Start Live Demo" button on /demo page
2. POST /api/demo/initialize creates/reuses demo inboxes at agentmail.to
3. Seller agent generates personalized email via OpenAI (GPT-4)
4. Email sent from seller-demo@agentmail.to to buyer-demo@agentmail.to
5. Frontend polls GET /api/demo/messages every 3 seconds
6. Webhook receives buyer's incoming email, triggers auto-response
7. Buyer agent generates reply via Mastra + OpenAI
8. Messages appear in real-time in side-by-side viewer

**Key Technical Details:**
- AgentMail inboxes persisted across server restarts (reused via findInboxByEmail)
- Inbox lookup uses `inboxId` field (camelCase) which contains the email address
- OpenAI provider configured with createOpenAI({ apiKey: AI_INTEGRATIONS_OPENAI_API_KEY })
- Mastra agents (buyerAgent, sellerAgent) use tools for fit scoring and company research
- Error handling for AlreadyExistsError gracefully falls back to listing/finding existing inboxes

**Recent Fixes (Nov 1-3, 2025):**
- ✅ **Buyer message positioning** (Nov 3, 2025):
  - Simple formula: each buyer message positioned at `idx × 176 + 50` (50px below corresponding seller message)
  - Messages must be properly sorted chronologically on backend to ensure correct pairing
  - Backend sorts all messages by timestamp before filtering into seller/buyer arrays
- ✅ **Removed redundant webhook registration** (Nov 3, 2025):
  - Discovered AgentMail webhooks are configured at organization/pod level, not per-inbox
  - Removed per-demo webhook registration from `/api/demo/initialize`
  - Webhooks persist automatically for all inboxes in the pod
  - Simplified initialization flow and eliminated intermittent webhook registration failures
  - Errors now displayed inline in execution status instead of separate error banner
- ✅ **Implemented database persistence for production webhooks** (Nov 1, 2025):
  - Created `demo_sessions` table to persist inbox IDs and exchange count
  - Replaced in-memory storage with PostgreSQL database queries
  - Webhooks now load session from database using inbox_id lookup
  - Exchange counter persists across server restarts/deployments
  - Fixes production webhook failures caused by lost in-memory state
  - Created `server/db.ts` with Drizzle connection to Neon database
  - Storage interface methods: `createDemoSession()`, `getDemoSessionByInboxId()`, `getLatestDemoSession()`, `incrementExchangeCount()`
- ✅ **Fixed infinite loop bug** (Nov 1, 2025):
  - Added exchange counter to limit conversation (updated Nov 3 to MAX_EXCHANGES=6 for 7 total emails)
  - Current flow: seller → buyer (1) → seller (2) → buyer (3) → seller (4) → buyer (5) → seller (6) → STOP
  - Both buyer and seller webhook handlers check exchange count before responding
  - Exchange counter resets when initializing new demo
  - Prevents agents from replying endlessly to each other
- ✅ **Stripped email quote history** (Nov 1, 2025):
  - Created `extractNewContent()` function to remove quoted email threads (lines starting with `>` or `On 2025...`)
  - Applied to both webhook responses (so agents only see new content)
  - Applied to frontend message display (users see clean messages without long quote chains)
  - Messages now show only the new content, not the entire conversation history
- ✅ Fixed historical message accumulation bug: Implemented session-based filtering to show only current conversation
  - Session timestamp set 5 seconds before demo initialization to ensure new messages are captured
  - Filter messages by timestamp (only show messages sent after session start)
  - Deduplicate by unique messageId to prevent any duplicates
  - Added debug logging showing total vs. filtered message counts
  - Result: Shows exactly 1 new message per session instead of 20+ accumulated historical messages
- ✅ Fixed duplicate message bug: AgentMail's listMessages() is pod-scoped and returns all messages regardless of inbox_id
- ✅ Solution: Client-side filtering by message.from address (seller pane shows messages FROM seller, buyer pane shows messages FROM buyer)
- ✅ Fixed timestamp parsing to handle both camelCase (createdAt) and snake_case (created_at) formats
- ✅ Enhanced CTA styling: Made "Click Start Live Demo" text bold and larger for better visibility
- ✅ Implemented hybrid demo approach (guaranteed reliability):
  - **Immediate Response**: Buyer agent responds immediately after seller sends initial email (same API request)
  - **Webhook System**: Webhooks registered for follow-up messages and future scalability
  - Fixed webhook event type: Changed from `message_received` to `message.received` (dot notation per AgentMail API spec)
  - Webhook endpoint handles AgentMail's `message.received` event structure
  - Production-ready: Uses REPLIT_DEV_DOMAIN (dev) or REPLIT_DOMAINS (production)
  - Comprehensive logging: All phases logged with clear visual separators for debugging
- ✅ **UI Refactor: Webhooks now inline chronologically** (Nov 1, 2025):
  - Removed separate "Webhook Events" section
  - Webhooks now appear inline within execution flow at correct chronological position
  - Buyer webhook appears after "Sent email to buyer" (seller's step 4)
  - Seller webhook appears at end after buyer sends reply
  - Each webhook is expandable with event ID, from/to addresses, and full payload details
  - Placeholder "Waiting for webhook..." shows until buyer webhook arrives
  - Both seller and buyer panes use identical rendering logic for consistency

**Testing:**
- End-to-end test confirmed both agents communicate via real emails
- Live messages appear in both seller and buyer panes
- Button state transitions correctly (Start → Watching Live Agents)