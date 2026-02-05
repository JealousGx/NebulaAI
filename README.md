# Nebula AI: Universal Model Gateway

Nebula AI is a developer-centric, self-hosted dashboard that acts as a secure, intelligent proxy and management layer for all your third-party AI model APIs.

Stop scattering your Hugging Face, Replicate, and OpenAI keys across multiple projects. Centralize them with Nebula, generate a single unified endpoint for each, and monitor usage, costs, and performance in real-time from a sleek, futuristic dashboard.

## Core Features

- **Centralized Key Vault:** Securely add, edit, and delete API credentials for any AI service. Keys are encrypted at rest.

- **Unified Proxy Endpoints:** Automatically generates a unique, internal API endpoint for each configured model, keeping your private keys off the client.

- **Request Transformation Engine:** Define how incoming requests are mapped and transformed before being sent to the third-party AI, allowing for a consistent API interface for all your projects.

- **Usage Analytics Dashboard:** Visualize API calls, credit consumption, errors, and latency with interactive charts.

- **Real-time Debugging:** A live request/response log stream for each endpoint, making debugging a breeze.

- **Optional Caching:** (Future) Built-in caching to reduce latency and save costs on duplicate prompts.

## Design Philosophy

The UI is a core feature, not an afterthought. Built with a "dark mode first" approach, it leverages glassmorphism, subtle animations, and a monospace-first typography (Geist Mono, JetBrains Mono) to create a futuristic and highly functional developer experience.

### Technical Stack

- **Framework:** TanStack Start

- **API Layer:** tRPC (for end-to-end typesafe APIs)

- **Database & ORM:** DrizzleORM & MySQL

- **Authentication:** Better Auth

- **Styling:** Tailwind CSS (with a custom Oklch-based theme)

- **UI Components:** Shadcn UI (for core components) & Aceternity UI (for unique, futuristic visuals)

- **Animation:** Framer Motion

## Getting Started

Clone the repository.

Install dependencies: `pnpm install`

Set up your `.env` file (see `.env.example`).

Run the database migrations: `pnpm run db:push`

Start the development server: `pnpm run dev`

--

### Recommendations for Improvement

1.  Implement Rate Limiting (Priority for Security):

    - Where: This should ideally be handled by a middleware before your tRPC router, or even at an API gateway level if you have one.
    - What: Configure limits for requests containing the x-api-key header, especially for requests that result in invalid API keys, to prevent rapid guessing attempts.

2.  Introduce an API Key Caching Layer (Priority for Performance):

    - What: After a successful database lookup of an API key, cache the userId (and any other relevant user data like roles or permissions) associated with that key in a fast, in-memory store like Redis
      or a simple in-process cache.
    - How `context.ts` would change (conceptual):

    1 // ...
    2 import { getCachedApiKeyData, setCachedApiKeyData } from "@/lib/cache" // New caching utility
    3
    4 export async function createContext({ req }: FetchCreateContextFnOptions) {
    5 // ... existing session logic ...
    6
    7 if (!userId) {
    8 const headerApiKey = req.headers.get("x-api-key")
    9 if (headerApiKey) {

10 let cachedData = await getCachedApiKeyData(headerApiKey); // Check cache first
11
12 if (cachedData) {
13 userId = cachedData.userId;
14 } else {
15 const foundKey = await db
16 .select()
17 .from(apiKey)
18 .where(eq(apiKey.key, headerApiKey))
19 .limit(1)
20
21 if (foundKey.length > 0) {
22 userId = foundKey[0].userId
23 await setCachedApiKeyData(headerApiKey, { userId }, { ttl: 300 }); // Cache for 5 minutes
24 }
25 }
26 }
27 }
28 // ...
29 } \* Benefits: This would drastically reduce the number of direct database reads for API key validation, significantly improving performance under load.
