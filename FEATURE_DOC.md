Feature Documentation: AI Model Proxy (v2)

1. Overview

1.1. Project Goal

To create a sophisticated, secure, and developer-centric web dashboard that acts as a central proxy for third-party AI models. This platform allows for secure management of API keys, creation of unified proxy endpoints, and real-time monitoring of usage, costs, and errors.

1.2. Core Functionality

Secure Key Vault: Centralized, encrypted storage for all third-party AI API keys.

Proxy Endpoint Generation: Automatically generate a unique, internal API endpoint for each configured AI model.

Request Transformation: A flexible engine to map and modify incoming requests to match the required format of the downstream AI API.

Usage Analytics & Logging: A detailed dashboard to visualize key metrics and a real-time log stream for debugging.

2. Key Features

2.1. Dashboard & Analytics

The central hub for monitoring all AI model activities.

2.1.1. Main Overview: An "at-a-glance" view displaying aggregate metrics:

Total API requests (today / 7 days / month).

Total estimated costs or credits consumed (this month).

Number of active endpoints.

System-wide error rate.

2.1.2. Endpoints List: A rich list of all configured AI models, presented using visually distinct components (not just plain cards).

Each item will display: Model Name, Generated Proxy Endpoint (with copy button), Provider (Replicate, etc.), Status (Active, Inactive, Error), and a 24-hour usage sparkline.

Actions: "View Stats", "View Logs", "Edit", "Delete".

2.1.3. Detailed Analytics View: A dedicated page for each endpoint with interactive charts (Recharts) for:

Request Volume vs. Time.

Cost/Credit Consumption vs. Set Limits.

Response Status Codes (2xx, 4xx, 5xx) breakdown.

Average API Latency (ms).

2.1.4. Real-time Request Log:

A "live tail" view (like a terminal) for a specific endpoint.

Shows incoming request headers/body (sanitized) and the corresponding outgoing proxy request and its response status/body.

Essential for debugging the Request Transformation Engine.

2.2. AI Model & API Key Management

The core configuration workflow for the application.

2.2.1. Add New Endpoint Flow: A multi-step modal (Shadcn Dialog) flow:

Step 1: Identification: Endpoint Name (unique), Provider (dropdown: Replicate, OpenAI, Custom), Description.

Step 2: Authentication: Third-Party API URL, Authentication Method (Bearer, Custom Header), API Key / Secret (input is masked and write-only).

Step 3: Limits & Policies: Optional Rate Limit (reqs/min), Monthly Cost Limit (auto-disable), Status (Active/Inactive).

2.2.2. Request Transformation Engine:

This is the final step in the "Add" flow and is editable later.

Provides a simple JSON editor interface.

The user defines a JSON template of the outgoing request.

Uses a simple template syntax (e.g., {{client.prompt}}) to map data from the incoming request body to the correct fields for the third-party API.

Example: User defines {"input": {"prompt": "{{client.body.user_prompt}}"}}. This tells the proxy to take the user_prompt field from the incoming JSON and map it to input.prompt for the Replicate API.

2.2.3. Edit/Delete Endpoint: Standard edit (all fields, but API key is write-only) and delete (with a typed-name confirmation) flows.

2.2.4. Secure Key Vault:

This is the underlying system for all key management.

DrizzleORM will be used to manage the database schema.

The database will store endpoint metadata (name, URL, limits, transformation rules).

All sensitive API keys and secrets will be encrypted at rest within the database using a strong encryption algorithm and a secret key known only to the application server.

2.3. User Experience & Interface

2.3.1. Theme: Dark mode first, with a high-contrast, clean light mode available. The provided Oklch theme will be the default.

2.3.2. Aesthetic: A futuristic, "glassmorphic" design. Uses backdrop-filter: blur() on modal and panel surfaces to create a frosted glass effect over a subtly animated background (e.g., Aceternity's Vortex).

2.3.3. Typography: Monospace fonts (Geist Mono, JetBrains Mono) are used for all labels, data, and navigation to enforce the developer-tool aesthetic.

2.3.4. Motion: Framer Motion is used for all page transitions, modal appearances, and micro-interactions (hover effects, list item expansion) to create a fluid and responsive feel.

2.4. Caching (Optional v2 Feature)

2.4.1. Caching Layer: An optional caching mechanism (e.g., Redis) can be enabled.

2.4.2. Functionality: When enabled, the proxy will cache successful responses from the third-party API based on a hash of the request body.

2.4.3. Benefit: Drastically reduces costs and improves latency for repeated/common prompts. The cache TTL (Time To Live) will be configurable per endpoint.

3. Technical Stack

Frontend Framework: TanStack Start (React)

API Layer: tRPC (End-to-end typesafe API)

Database & ORM: DrizzleORM (for config, logs, and encrypted key metadata)

Authentication: Better Auth

UI Components: Shadcn UI, Aceternity UI

Styling: Tailwind CSS (with custom Oklch theme)

Animation: Framer Motion

State Management: TanStack Query (for all data fetching)

Charts: Recharts
