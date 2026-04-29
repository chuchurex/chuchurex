# CLAUDE.md - Instrucciones para Claude Code

Este archivo es la fuente unica de verdad sobre como trabajar con este repo.

## Que es este repo

`chuchurex/chuchurex` en GitHub. Cumple doble proposito:
- Codigo del sitio chuchurex.cl (frontend) y su API (backend)
- Pipeline de chatbot con generacion de propuestas en PDF

Hay un rediseño en curso para Bombus Lab en la rama `feature/hero-bombus`.

## Stack

- **Frontend:** HTML/CSS/JS vanilla, hosting Cloudflare Pages, dominio chuchurex.cl
- **Backend:** FastAPI (Python 3.13), Claude API (Haiku para chat, Sonnet para PDFs), hosting Fly.io
- **PDFs:** Node 20 + Puppeteer + markdown-it
- **DNS:** Cloudflare

## Estructura

```
chuchurex.cl/
├── backend/                   # Codigo Python
│   ├── app.py                 # FastAPI principal
│   ├── requirements.txt
│   └── pdf-generator/         # Node + Puppeteer
├── frontend/                  # HTML/CSS/JS (Cloudflare Pages)
├── docs/                      # Documentacion vigente
│   ├── TARIFAS.md
│   ├── DOCS_PDF_GENERATION.md
│   └── archive/               # Docs historicos
├── nic.cl/                    # Scripts utilitarios verificacion dominios .cl
├── proposals/                 # PDFs generados (gitignored salvo test.md)
├── private/                   # Archivos personales (gitignored)
├── inbox/                     # Staging local (gitignored)
├── Dockerfile, fly.toml       # Config Fly.io
├── package.json               # Scripts npm
├── dev.sh                     # Script de desarrollo local
└── DEPLOY.md, README.md       # Docs principales
```

## Comandos

```bash
# Desarrollo local
npm run dev              # Frontend (3007) + abre browser
npm run dev:frontend     # Frontend (3007) sin abrir browser
npm run dev:backend      # Backend (8002) - requiere .venv con uvicorn
npm run pdf:test         # Test generacion PDF manual

# Deploy
git push origin main     # Frontend → Cloudflare Pages auto-deploy (~1 min)
fly deploy               # Backend → Fly.io
```

## Reglas de deploy

| Cambio en | Deploy con | Hosting |
|-----------|-----------|---------|
| `frontend/` | `git push origin main` | Cloudflare Pages |
| `backend/`, `Dockerfile` | `fly deploy` | Fly.io |

**Nunca:** rsync, scp, ssh para frontend. Cloudflare maneja todo desde GitHub.

## Cuando el usuario dice...

- "publica" / "deploy" / "push a produccion" → Ejecuta el deploy correspondiente sin preguntar
- "como deployo?" → Sigue este documento

## Verificacion post-deploy

- Frontend: https://chuchurex.cl
- Backend health: https://api.chuchurex.cl/health
- Logs Fly: `fly logs -a chuchurex-api`

## Notas operacionales

- Backend Fly.io usa auto-stop con `min_machines_running = 0`. Primera request puede tardar ~2s en levantar la maquina.
- Secrets se setean con `fly secrets set NAME=value -a chuchurex-api`. Listar: `fly secrets list -a chuchurex-api`.
- Imagen Docker incluye Chromium del sistema para Puppeteer (`PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`).

## Branches

- `main` - produccion
- `feature/hero-bombus` - rediseño Bombus Lab (WIP)

## Sub-proyectos

- `nic.cl/` - scripts Python para verificar disponibilidad de dominios .cl via WHOIS de NIC Chile. Ver `nic.cl/GUIA_VERIFICAR_DOMINIOS_CL.md`.

## Documentacion adicional

- `DEPLOY.md` - guia completa de deploy
- `docs/TARIFAS.md` - tarifas y condiciones del negocio
- `docs/DOCS_PDF_GENERATION.md` - arquitectura del sistema de PDFs
- `docs/archive/` - docs historicos (Vultr, planes ya implementados)
