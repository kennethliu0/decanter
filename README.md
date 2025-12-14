# Decanter

A streamlined process for seeking event supervisors for Science Olympiad tournaments

## Setup

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/decanter.git
   cd decanter
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the example environment file and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your Supabase credentials:

   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_PUBLISHABLE_OR_ANON_KEY` - Your Supabase anon/public key
   - `NEXT_PUBLIC_SITE_URL` - Your site URL (use `http://localhost:3000` for local development)

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Vitest
- `npm run coverage` - Run tests with coverage
