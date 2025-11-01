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
- In-memory storage implementation (`MemStorage`) for development
- Drizzle ORM configured for PostgreSQL (production-ready)
- Schema includes User model with support for AgentBox-specific types (Profile, ThreadState, Status)
- Migration system via drizzle-kit

**Data Models:**
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
- **AgentMail**: Core email infrastructure for @agentbox.ai addresses (API key configured via AGENTMAIL_API_KEY secret)
  - Note: Using manual API key setup instead of Replit connector integration
- **Convex.dev**: Real-time backend for state synchronization (requires manual `npx convex dev` in local terminal)
  - Note: Cannot auto-initialize in non-interactive environment - user must run locally
- **OpenAI / Mastra**: LLM-based agent intelligence (using AI_INTEGRATIONS_OPENAI_API_KEY from Replit integration)
- **Perplexity**: Company research and enrichment (API key configured via PERPLEXITY_API_KEY secret)
- **Calendar APIs**: Google Calendar and Outlook integration for automatic meeting scheduling (planned)

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