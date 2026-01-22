# Flux Dashboard

Dashboard for managing Cloudflare resources built with Astro and deployed on Cloudflare Pages.

## Tech Stack

- **Framework:** Astro 5.x with SSR
- **Deployment:** Cloudflare Pages
- **Backend:** Astro API routes (Pages Functions)
- **Styling:** CSS Custom Properties with dark mode support
- **Transitions:** Astro View Transitions for smooth navigation

## Development

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview Pages build locally
bun run preview
```

## Deployment

### GitHub Actions (Recommended)

The application automatically deploys to Cloudflare Pages via GitHub Actions when pushing to `main` branch.

**Required Secrets:**
Add these to your GitHub repository settings under Settings > Secrets and variables > Actions:

- `CLOUDFLARE_API_TOKEN` - API token with Cloudflare Pages permissions (Create at https://dash.cloudflare.com/profile/api-tokens)
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare Account ID

**Manual Deployment via GitHub Actions:**
Go to Actions > Deploy to Cloudflare Pages > Run workflow

### Local Deployment

```bash
# Deploy to production (builds + deploys)
bun run deploy
```

**Live URL:** https://flux.cloudemo.org

**Pages URL:** https://cf-worker-flux.pages.dev

## Project Structure

```
/
├── src/
│   ├── pages/              # Route pages (file-based routing)
│   │   ├── index.astro     # Homepage / Overview
│   │   ├── dashboard/
│   │   │   ├── [section].astro          # Dynamic section pages
│   │   │   └── caching/
│   │   │       └── manage.astro         # Cache rule management
│   │   └── api/
│   │       └── actions/
│   │           └── [actionName].ts      # Backend API endpoints
│   ├── components/         # Reusable components
│   ├── layouts/            # Layout templates
│   └── types/              # TypeScript types
├── dist/                   # Build output (not committed)
└── wrangler.toml          # Cloudflare Pages configuration
```

## Features

- ✅ Server-side rendering (SSR)
- ✅ Client-side navigation with View Transitions
- ✅ Dark mode support
- ✅ Backend API endpoints for Cloudflare API integration
- ✅ Cache rule management
- ✅ Responsive design

## API Endpoints

Backend functions are available at `/api/actions/[actionName]`:

- `get-cache-rule-status` - Fetch cache rule status from Cloudflare
- `toggle-cache-rule` - Enable/disable cache rules
- Additional mock endpoints for UI demonstration

## Environment Variables

Set in Cloudflare Pages dashboard under Settings > Environment variables:

```
ENVIRONMENT=production
```

