# Flux - Awesome Cloudflare Demos

**Live Demo:** https://flux.cloudemo.org

> **Note:** Most demos require your own domain to fully experience features. For example, Firewall for AI only works with WAF rules configured on your Cloudflare account.

Interactive demos showcasing Cloudflare's powerful platform.

## Demos

- **[Firewall for AI](/firewall-for-ai)** - Test Cloudflare's AI-powered prompt filtering with real-time PII and unsafe content detection
- **[Cloudflare Images](/images)** - Transform images using Cloudflare CDN-powered transformations

## Tech Stack

- **Framework:** Astro 5.x with SSR
- **Deployment:** Cloudflare Pages
- **AI Model:** Cloudflare Workers AI (Llama 3.1 8B)

## Development

```bash
bun run dev
bun run build
```

## Deployment

Automatically deploys via GitHub Actions on push to `main`.

**Required Secrets:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
