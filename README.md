# Frontend

React 19 + TypeScript SPA for the portfolio site.

## Stack

- React 19, TypeScript, Vite 8
- Tailwind CSS v4 (inline styles for admin, utility classes for public)
- TanStack Query v5
- Zustand v5 (auth, theme, language stores)
- React Router v7
- Axios, Sonner, Lucide React, react-icons
- @react-pdf/renderer (CV builder PDF export)

## Development

```bash
cd frontend
cp .env.example .env
bun install   # or npm install
bun dev       # or npm run dev
# http://localhost:5173
```

Requires backend running on `http://localhost:8080`.

## Build

```bash
bun run build   # or npm run build
# Output in dist/
```

## Docker

```bash
docker build -t portfolio-frontend .
docker run -p 80:80 portfolio-frontend
```

## Environment Variables

| Variable            | Description      | Default                 |
| ------------------- | ---------------- | ----------------------- |
| `VITE_API_BASE_URL` | Backend base URL | `http://localhost:8080` |

In Docker/production, leave `VITE_API_BASE_URL` empty — nginx proxies `/api` to the backend container.

## Structure

```
src/
├── api/
│   ├── client.ts        # Axios instances (public + admin)
│   ├── public.ts        # Public API calls
│   └── admin.ts         # Admin API calls
├── components/
│   └── public/          # Navbar, Footer, Layout, LoadingStates
├── pages/
│   ├── admin/           # Admin panel pages + CV builder
│   └── public/          # Public portfolio pages
├── store/
│   ├── authStore.ts     # Auth state + session persistence
│   ├── themeStore.ts    # Dark/light theme
│   └── languageStore.ts # EN/ID language toggle
├── styles/
│   └── globals.css      # Design tokens + global styles
└── types/
    └── index.ts         # Shared TypeScript interfaces
```

## Features

- Bilingual UI (EN / ID) — all admin and public text
- Dark / light theme with localStorage persistence
- Admin panel with full CRUD for all content
- CV builder with 5 PDF templates and A4/Letter page size
- Contact form with email notification
