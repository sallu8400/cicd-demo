# cicd-demo

Demo project for practising a Jenkins + GitHub CI/CD pipeline.

| Part | Tech | Folder |
|---|---|---|
| API | Node.js 22, Express 5, Jest + Supertest | [api/](api/) |
| Frontend | React 19, Vite, Vitest + Testing Library | [frontend/](frontend/) |
| Deploy | Docker Compose (nginx serves React and proxies `/api`) | [deploy/](deploy/) |
| Pipeline | Jenkins declarative pipeline | [Jenkinsfile](Jenkinsfile) |

## Branches

| Branch | Environment | URL |
|---|---|---|
| `main` | Production (after senior approval in Jenkins) | http://localhost:3200 |
| `dev` | Staging (auto deploy) | http://localhost:3100 |
| `feature/*` | Only tests run | — |

Never push directly to `main` or `dev`. Create a `feature/*` branch from `dev` and open a PR into `dev`.

## Run locally

```bash
# Terminal 1: API on http://localhost:3000
cd api
npm install
npm run dev

# Terminal 2: React on http://localhost:5173 (proxies /api to port 3000)
cd frontend
npm install
npm run dev
```

## Tests

```bash
cd api && npm test
cd frontend && npm test
```
