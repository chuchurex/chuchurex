# chuchurex.cl - Chatbot de cotización web con IA. Genera propuestas PDF automáticas.

## Stack
- Frontend: HTML/CSS/JS vanilla (Cloudflare Pages)
- Backend: FastAPI Python (Vultr VPS)
- AI: Claude API (Haiku chat + Sonnet PDF)
- PDF: Puppeteer + markdown-it

## Structure
- `frontend/` - Cliente web
- `pdf-generator/` - Generación de PDFs
- `app_unified.py` - Backend principal
- `deploy.sh` - Script de despliegue

## Commands
- `npm run dev` - Frontend (3007) + Backend (8002)
- `npm run dev:frontend` - Solo frontend (3007)
- `npm run dev:backend` - Solo backend (8002)
- `npm run pdf:test` - Test generación PDF

## URLs
- https://chuchurex.cl (frontend)
- https://api.chuchurex.cl (API)
- localhost:3007 (dev frontend)
- localhost:8002 (dev backend)

## Notes
- Multilingual ES/EN/PT
- VPS Vultr Ubuntu 24.04
- SSL Let's Encrypt, systemd + nginx

## Seguridad
- **NUNCA mostrar `.env`, `.env.backup`, ni archivos que contengan credenciales**
- **NUNCA imprimir, loggear ni incluir API keys, passwords, tokens o secretos en outputs**
