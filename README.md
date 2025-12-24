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
