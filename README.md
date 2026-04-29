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

### Requisitos

- Node 20+
- Python 3.13+
- (Opcional) Chromium o Chrome instalado para que Puppeteer genere PDFs en local. En Docker se usa Chromium del sistema.

### Setup primera vez

```bash
# 1. Instalar deps de Node (live-server + Puppeteer + markdown-it)
npm install
npm run pdf:install

# 2. Crear y activar virtualenv Python
python3 -m venv .venv
source .venv/bin/activate

# 3. Instalar deps Python
pip install -r backend/requirements.txt

# 4. Crear .env desde el ejemplo y completar ANTHROPIC_API_KEY
cp .env.example .env
# Editar .env y poner tu key real (sin esto el chat no responde)
```

### Levantar el stack para probar

Necesitas dos terminales (frontend y backend corren juntos pero por separado).

**Terminal 1 - Backend (puerto 8002):**

```bash
source .venv/bin/activate
npm run dev:backend
```

Deberias ver `Uvicorn running on http://0.0.0.0:8002`. Verifica con:

```bash
curl http://localhost:8002/health
# Esperado: {"status":"healthy","api":"connected"} si la key tiene creditos
```

**Terminal 2 - Frontend (puerto 3007):**

```bash
npm run dev:frontend
```

Abre http://localhost:3007 en el browser.

### Probar el flujo completo

1. Abre http://localhost:3007
2. Escribe en el chat (ej: "quiero una landing page para mi cafeteria")
3. Conversa hasta que el bot ofrezca generar PDF, acepta
4. El PDF aparece como link de descarga
5. Los archivos generados quedan en `backend/proposals/` (gitignored)
6. Las conversaciones se guardan en `backend/chats/*.json` (gitignored)
7. Para verlas via web: http://localhost:8002/chats?key=TU_CHATS_ACCESS_KEY

### Test manual del generador de PDFs

```bash
# Genera proposals/test.pdf desde proposals/test.md (sin tocar el backend)
npm run pdf:test
```

### Atajo: solo frontend con browser auto-abierto

```bash
npm run dev   # equivale a dev:frontend pero abre el browser
```

### Troubleshooting

| Sintoma | Causa probable | Fix |
|---------|----------------|-----|
| `health` devuelve `degraded` con "credit balance" | Cuenta Anthropic sin creditos | Recargar en console.anthropic.com |
| `health` devuelve `auth_error` | `ANTHROPIC_API_KEY` invalido o no seteado | Revisar `.env` |
| Frontend no llama al backend | URL hardcodeada o CORS | Verifica `frontend/js/app.js` apunte a `http://127.0.0.1:8002` en local |
| Puppeteer falla al generar PDF | Falta Chromium | `npx puppeteer browsers install chrome` |
| `npm run dev:backend` no encuentra uvicorn | venv no activo | `source .venv/bin/activate` antes |

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
