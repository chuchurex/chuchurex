# Deploy

## Architecture

| Component | Hosting | Deploy |
|-----------|---------|--------|
| Frontend | Cloudflare Pages | Auto-deploy desde GitHub (push a `main`) |
| Backend API | Fly.io | `fly deploy` |

---

## Frontend (chuchurex.cl)

Cloudflare Pages está conectado a `chuchurex/chuchurex` en GitHub. Cualquier push a `main` dispara deploy en ~1 min.

```bash
git add frontend/
git commit -m "descripcion"
git push origin main
```

Configuracion Cloudflare:
- Project: `chuchurex`
- Branch: `main`
- Build command: (none, archivos estaticos)
- Output directory: `frontend`

Verificar:
- https://chuchurex.cl
- https://chuchurex.cl/about.html
- https://chuchurex.cl/privacidad.html

---

## Backend API (api.chuchurex.cl)

Hosting: Fly.io (app `chuchurex-api`, region `gru`).

### Deploy

```bash
fly deploy
```

Esto construye la imagen desde `Dockerfile` (Python 3.13 + Node 20 + Chromium para Puppeteer), la sube a Fly y reinicia las maquinas. Configuracion en `fly.toml`.

### Secrets

Las variables sensibles (ANTHROPIC_API_KEY, CHATS_ACCESS_KEY) se manejan con:

```bash
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets list
```

### Logs y status

```bash
fly logs
fly status
```

### Verificar API

- https://api.chuchurex.cl
- https://api.chuchurex.cl/health
- https://api.chuchurex.cl/chats?key=${CHATS_ACCESS_KEY}

---

## Local development

```bash
npm run dev          # Frontend (3007) + abre browser
npm run dev:frontend # Frontend (3007) sin abrir browser
npm run dev:backend  # Backend (8002) - requiere venv
```
