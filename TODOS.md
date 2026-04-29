# TODOS - Bombus Lab

## Pendientes del eng review (2026-04-08)

### 1. Reescribir system prompts del chatbot para Bombus Lab
- **Que:** Los system prompts en `app_unified.py` estan calibrados para cotizar sitios web como freelancer (Chuchurex). Necesitan reescribirse para automatizacion con IA (Bombus Lab).
- **Por que:** El chatbot saluda como "Chuchurex, desarrollador web freelance". Los keywords de deteccion buscan "sitio", "web", "pagina". Las tarifas son de freelancer web ($200-800). Nada de esto aplica a Bombus Lab.
- **Alcance:** System prompts (3 idiomas), flujo de deteccion de proyecto, keywords, tarifas, PDF templates (2 funciones), personalidad del bot.
- **Depende de:** Definir que servicios y rangos de precio ofrece Bombus Lab.

### 2. Nuevo plan: Hero con abeja animada + estructura simplificada
- **Que:** Reemplazar la estructura actual (Hero + Bombus Steps 200vh + Servicios + Chat + About + Contacto) por: Hero 100vh con abeja animada integrada + Portfolio + Chat mejorado + Footer.
- **Por que:** Los 4 pasos de Bombus Steps eran relleno. La abeja animada tiene mas impacto en el hero. El chat necesita mejores outputs y CTAs.
- **Alcance:** Nuevo design doc via /office-hours, luego implementacion.
- **Depende de:** Cerrar el eng review actual. Definir contenido del portfolio.
