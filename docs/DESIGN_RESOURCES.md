# Design Resources for UI Development

When implementing or upgrading UI in `tools/explorer` or project templates, use these resources as reference for layouts, components, and patterns.

## Primary: Square UI

**[Square UI](https://github.com/ln-dev7/square-ui)** — Collection of open-source layouts built with Next.js, shadcn/ui, and Tailwind CSS.

- **Live demos**: [square.lndev.me](https://square.lndev.me)
- **License**: MIT
- **Templates**: 20+ layouts including dashboards (5 variants), tasks, calendar, chat, emails, files, maps, leads, and more

Use Square UI as the primary reference for:
- Dashboard layouts (stats, charts, tables)
- Detail panels and slide-out drawers
- Data tables with filters
- Task/kanban and chat-style UIs

**Note**: Square UI templates are Next.js-based. Adapt layout patterns and structure to your stack (Vite, React, etc.); do not copy-paste raw template code.

## Alternatives and Directories

| Resource | What It Provides |
|----------|------------------|
| **[Shadcn Admin](https://www.shadcn.io/template/author/satnaing)** | Vite + React admin dashboard; 10+ pages, command palette, RTL. Ideal for Vite-based apps. |
| **[Kibo UI](https://kiboui.com)** | 1000+ free shadcn component variants ("patterns") |
| **[Shadcnblocks](https://shadcnblocks.com)** | 1200+ free blocks; Radix or Base UI; CLI install |
| **[Magic UI](https://magicui.design)** | 50+ animated components; Framer Motion; copy-paste |
| **[Aceternity UI](https://ui.aceternity.com)** | shadcn-compatible blocks; hero, feature, bento, navbars |
| **[Horizon UI shadcn Boilerplate](https://github.com/horizon-ui/shadcn-nextjs-boilerplate)** | Admin dashboard with ChatGPT UI integration |
| **[Kiranism next-shadcn-dashboard](https://github.com/Kiranism/next-shadcn-dashboard-starter)** | Production-ready dashboard: auth, multi-tenant, data tables, analytics |

## Directories

- **[shadcn.io/template](https://www.shadcn.io/template)** — Official template gallery (330+ templates)
- **[shadcntemplates.com](https://www.shadcntemplates.com)** — Community directory of themes and components

## Usage

1. **tools/explorer**: Panels, legends, and views use shadcn/ui plus Square UI-inspired patterns (card layouts, badges, stat cards, scroll areas).
2. **New features**: When adding dashboards, detail panels, or data tables, reference Square UI demos for layout and spacing.
3. **Consistency**: Keep the dark slate aesthetic (`#0f172a`, `#1e293b`, `#334155`) unless the project specifies otherwise.
