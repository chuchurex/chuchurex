# Chuchurex - Chatbot MVP (Beta)

Chatbot para cotización de proyectos web con IA.

> **Estado: Beta** - Las conversaciones se almacenan para análisis y mejora del sistema.

## URLs de Producción

- **Frontend**: https://chuchurex.cl
- **API**: https://api.chuchurex.cl
- **Repositorio**: https://github.com/chuchurex/chuchurex

## Stack Técnico

### Frontend
- HTML/CSS/JS vanilla
- Hospedado en Cloudflare Pages
- Dominio: chuchurex.cl (Cloudflare DNS)

### Backend
- FastAPI + Python 3.13
- Claude API (Haiku para chat, Sonnet para PDFs)
- Hospedado en Fly.io (app `chuchurex-api`, region `gru`)
- Container con Chromium del sistema para Puppeteer

## Estructura del Proyecto

```
chuchurex.cl/
├── backend/
│   ├── app.py              # API FastAPI principal
│   ├── requirements.txt
│   └── pdf-generator/      # Node + Puppeteer
├── frontend/
│   ├── index.html          # Pagina principal con chat
│   ├── about.html, privacidad.html
│   ├── styles/main.css
│   └── js/app.js, i18n.js
├── Dockerfile, fly.toml    # Deploy Fly.io
└── README.md
```

## Acceder a los chats guardados

Via web: `https://api.chuchurex.cl/chats?key=${CHATS_ACCESS_KEY}`

## Comandos utiles (Fly.io)

```bash
# Ver logs en vivo
fly logs -a chuchurex-api

# Status
fly status -a chuchurex-api

# SSH a la maquina
fly ssh console -a chuchurex-api

# Setear secret
fly secrets set ANTHROPIC_API_KEY=sk-ant-... -a chuchurex-api

# Deploy
fly deploy
```

## Configuración del Chat (System Prompt)

El chatbot está configurado con las siguientes características:

### Personalidad
- Amigable y profesional
- Español chileno natural (sin exagerar)
- Lenguaje inclusivo neutral
- Una pregunta a la vez (conversación natural)

### Tarifas
| Servicio | Precio USD |
|----------|------------|
| Landing page | $200-300 |
| Sitio web (5-10 págs) | $500-800 |
| Rediseño | $400-600 |
| App web simple | $800-1500 |
| App web compleja | $1500-3000 |

### Condiciones
- Vigencia cotización: 2 días hábiles
- Pago: 100% al finalizar
- Descuento máximo: 20%

### Tecnologías que ofrecemos
- WordPress y cualquier CMS
- Código custom (HTML/CSS/JS, frameworks)

## Deploy

> **Para Claude Code:** ver `CLAUDE.md` o `DEPLOY.md`

### Frontend (Cloudflare Pages)
Deploy automatico al hacer push a `main`:

```bash
git add frontend/
git commit -m "descripcion del cambio"
git push origin main
```

### Backend (Fly.io)
```bash
fly deploy
```

**Documentacion completa:** ver `DEPLOY.md`

## Diseño

### Paleta de colores
- **Crema**: #F5F0E6 (fondo)
- **Conchevino**: #722F37 (acentos)
- **Texto**: #4A3C3F

### Tipografías
- **Serif**: Cormorant Garamond (logo, títulos)
- **Sans**: Inter (texto general)

## Contacto

- **Email**: carlos@chuchurex.cl
- **Web**: https://chuchurex.cl
