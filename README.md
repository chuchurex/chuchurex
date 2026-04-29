# chuchurex.cl

Codigo del sitio [chuchurex.cl](https://chuchurex.cl) y su API. Chatbot para cotizar proyectos web con IA y generar propuestas en PDF.

## Stack

- **Frontend:** HTML/CSS/JS vanilla, Cloudflare Pages
- **Backend:** FastAPI (Python 3.13), Fly.io
- **AI:** Claude API (Haiku para chat, Sonnet para PDFs)
- **PDFs:** Node 20 + Puppeteer + markdown-it

## Estructura

```
chuchurex.cl/
├── backend/                # API Python
│   ├── app.py              # FastAPI principal
│   ├── requirements.txt
│   └── pdf-generator/      # Node + Puppeteer
├── frontend/               # HTML/CSS/JS estaticos
├── docs/                   # Documentacion
│   └── archive/            # Docs historicos
├── nic.cl/                 # Scripts utilitarios para verificacion de dominios .cl
├── proposals/              # PDFs generados (gitignored salvo test.md)
├── private/                # Archivos personales (gitignored)
├── inbox/                  # Staging local (gitignored)
├── Dockerfile, fly.toml    # Config Fly.io
├── package.json            # Scripts npm + deps
├── dev.sh                  # Script de desarrollo local
├── CLAUDE.md               # Instrucciones para Claude Code
├── DEPLOY.md               # Guia de deploy
└── README.md               # Este archivo
```

## Desarrollo local

Requisitos: Node 20+, Python 3.13, ffmpeg (opcional para PDFs).

```bash
# Frontend (3007) + abre browser
npm run dev

# Solo frontend (sin abrir browser)
npm run dev:frontend

# Solo backend (8002) - requiere .venv con uvicorn
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
npm run dev:backend
```

## Deploy

| Cambio en | Comando | Hosting |
|-----------|---------|---------|
| `frontend/` | `git push origin main` | Cloudflare Pages (auto) |
| `backend/`, `Dockerfile` | `fly deploy` | Fly.io |

Detalles en [`DEPLOY.md`](DEPLOY.md).

## URLs

- Produccion: https://chuchurex.cl
- API: https://api.chuchurex.cl
- Health: https://api.chuchurex.cl/health

## Sub-proyectos

### `nic.cl/`

Scripts Python utilitarios para consultar disponibilidad de dominios `.cl` via WHOIS de NIC Chile. No es parte del runtime del sitio. Ver [`nic.cl/GUIA_VERIFICAR_DOMINIOS_CL.md`](nic.cl/GUIA_VERIFICAR_DOMINIOS_CL.md).

## Branches

- `main` - produccion
- `feature/hero-bombus` - rediseño Bombus Lab (WIP)

## Documentacion

- [`CLAUDE.md`](CLAUDE.md) - instrucciones para Claude Code
- [`DEPLOY.md`](DEPLOY.md) - guia de deploy
- [`CHATBOT.md`](CHATBOT.md) - configuracion del chatbot
- [`docs/TARIFAS.md`](docs/TARIFAS.md) - tarifas
- [`docs/DOCS_PDF_GENERATION.md`](docs/DOCS_PDF_GENERATION.md) - arquitectura PDF
- [`docs/archive/`](docs/archive/) - docs historicos

## Contacto

carlos@chuchurex.cl
