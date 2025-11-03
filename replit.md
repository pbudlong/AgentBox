# AgentBox - AI-Powered Meeting Qualification Platform

## Overview

AgentBox is a B2B SaaS platform that leverages AI agents to automate the sales meeting qualification process. It allows sellers and buyers to communicate via dedicated @agentbox.ai email addresses, where AI agents intelligently:

- Qualify prospects based on multiple signals (industry, company size, budget, timing, tech stack).
- Automatically ask clarifying questions.
- Schedule meetings only when there is a strong mutual fit.
- Significantly reduce no-shows and unqualified meetings.

The platform was developed during a hackathon, featuring a "hauntingly efficient" dark mode aesthetic. It showcases agent-to-agent email conversations through a side-by-side demo viewer and provides detailed landing pages for sellers and buyers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for development and bundling, and Wouter for client-side routing. It utilizes `shadcn/ui` components based on Radix UI, styled with Tailwind CSS, featuring a dark mode-first design inspired by "Linear's clean minimalism + Superhuman's email elegance" with a Halloween aesthetic. State management is handled by TanStack Query for server state and React hooks for local component state, with real-time updates via polling. The key page structure includes a 5-step demo flow with a progress indicator, a side-by-side email client viewer, a profile viewer, and a fit score visualization.

### Backend Architecture

The backend runs on an Express.js server with TypeScript, using ESM modules. It provides a RESTful API with specific webhook endpoints for inbound email processing. The storage layer uses a PostgreSQL database with Drizzle ORM (Neon serverless) for persistence, including `users`, `demo_sessions`, `SellerProfile`, `BuyerProfile`, and `ThreadState` data models. A migration system is managed by `drizzle-kit`.

### Agent Intelligence System

The core of AgentBox is its AI-powered fit scoring engine, which evaluates multiple signals (e.g., industry match, budget, timing, tech stack compatibility) using a weighted algorithm. This engine drives a three-tier decision process: polite decline, asking clarifying questions, or proposing meeting times. The conversation flow involves inbound email triggering webhooks, profile loading, signal extraction, fit score computation, and generating appropriate email responses using structured templates for clarification, meeting proposals, and declines.

### Design System

The design system employs Inter or DM Sans for primary typography and Fira Code/Geist Mono for accents. It features a comprehensive color system defined by CSS custom properties, optimized for dark mode with subtle gradients and an opacity-based elevation system. Component patterns include card-based layouts, badge systems, progress indicators, and responsive grid layouts, with a fixed 2-column demo viewer for side-by-side displays.

## External Dependencies

-   **AgentMail**: Provides core email infrastructure for `@agentmail.to` addresses, handling dynamic inbox creation and webhook integration for email processing. Webhooks are configured at the organization level.
-   **OpenAI / Mastra**: Utilized for LLM-based agent intelligence, powering buyer and seller agent responses and conversation generation.
-   **Perplexity**: Used for company research and enrichment to inform agent decisions.
-   **Neon Database**: Serverless PostgreSQL database for data persistence.
-   **Drizzle ORM**: Type-safe ORM for database interactions.
-   **shadcn/ui + Radix UI**: UI component library.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
-   **React Query**: For data fetching and caching on the frontend.
-   **Zod**: Runtime type validation.