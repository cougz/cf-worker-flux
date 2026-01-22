# Flux - Awesome Cloudflare Demos

Interactive demos showcasing Cloudflare's developer platform.

## Demos

- **Firewall for AI** - Test Cloudflare's AI-powered prompt filtering with real-time PII and unsafe content detection

## Tech Stack

- **Framework:** Astro 5.x with SSR
- **Deployment:** Cloudflare Pages
- **AI Model:** Cloudflare Workers AI (Llama 3.1 8B)
- **Styling:** CSS with dark mode support

## Development

```bash
bun run dev
bun run build
bun run preview
```

## Deployment

Automatically deploys via GitHub Actions on push to `main`.

**Required Secrets:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

**Live:** https://flux.cloudemo.org


