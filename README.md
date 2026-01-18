# CF Worker Flux

A flexible UI framework for managing Cloudflare resources through workers, built with Astro and Cloudflare Workers.

## Features

- **Dashboard Layout**: Cloudflare-inspired design with sidebar navigation
- **Interactive Components**: Buttons, sliders, inputs, selects, toggles with action handling
- **Display Components**: Cards, panels, alerts, value displays, code blocks
- **Theme Management**: Light/dark mode with persistence
- **State Management**: Centralized state manager with action execution
- **API Actions**: Generic action endpoint for server-side operations
- **Responsive Design**: Mobile-friendly layout

## Installation

```bash
bun install
```

## Development

```bash
bun run dev
```

## Build

```bash
bun run build
```

## Deployment

To deploy to Cloudflare Workers, set the `CLOUDFLARE_API_TOKEN` environment variable:

```bash
export CLOUDFLARE_API_TOKEN=your-token-here
bun run deploy
```

## Project Structure

```
cf-worker-flux/
├── src/
│   ├── components/
│   │   ├── interactive/     # Button, Slider, Input, etc.
│   │   ├── display/         # Card, Panel, AlertBox, etc.
│   │   ├── layout/          # Dashboard, Header, Sidebar
│   │   └── ui/              # BackgroundEffects, ThemeToggle
│   ├── layouts/             # Base layouts
│   ├── pages/               # Routes and API endpoints
│   ├── scripts/             # Client-side scripts
│   ├── styles/              # CSS files
│   └── types/               # TypeScript definitions
├── astro.config.mjs         # Astro configuration
├── wrangler.toml            # Cloudflare Workers config
└── package.json
```

## Component Usage

### Button
```astro
<Button
  label="Save Changes"
  actionName="save-config"
  variant="primary"
  size="md"
/>
```

### Panel
```astro
<Panel title="Settings" badge="Active" collapsible>
  <p>Your content here</p>
</Panel>
```

### ValueDisplay
```astro
<ValueDisplay
  label="Status"
  value="Operational"
  format="text"
  status="success"
/>
```

## Action Handlers

Actions are defined in `src/pages/api/actions/[actionName].ts`. Add new actions to the `actions` registry:

```typescript
const actions: Record<string, (data: any) => Promise<any>> = {
  'my-action': myActionHandler,
  // ...
};
```

## Theme Management

The theme toggle is in the top-right corner. Themes persist in localStorage and respect system preferences.

## License

MIT
