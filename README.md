# Frontend

React 19 + TypeScript + Tailwind CSS v4 SPA for the portfolio site.

## Stack

- React 19, TypeScript, Vite 8
- Tailwind CSS v4
- TanStack Query v5
- Zustand v5
- React Router v7
- Axios, Sonner, Lucide React

## Development

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# http://localhost:5173
```

Requires backend running on `http://localhost:8080` (proxied via Vite).

## Build

```bash
npm run build
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
├── api/          # publicAPI + adminAPI (Axios)
├── components/   # Shared UI components
├── pages/
│   ├── admin/    # Admin panel pages
│   └── public/   # Public portfolio pages
├── store/        # Zustand (auth, theme, language)
├── styles/       # Global CSS + Tailwind theme
└── types/        # Shared TypeScript types
```
