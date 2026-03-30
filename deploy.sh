#!/bin/bash
# =============================================================================
# CHUCHUREX - Script de Despliegue a Producción
# Ejecutar desde la raíz del proyecto: ./deploy.sh
# =============================================================================

set -e  # Salir si hay error

# Load environment variables (only deployment-related ones)
if [ -f .env ]; then
    VPS_USER=$(grep '^VPS_USER=' .env | cut -d'=' -f2-)
    VPS_HOST=$(grep '^VPS_HOST=' .env | cut -d'=' -f2-)
    VPS_PATH=$(grep '^VPS_PATH=' .env | cut -d'=' -f2-)
    CHATS_ACCESS_KEY=$(grep '^CHATS_ACCESS_KEY=' .env | cut -d'=' -f2-)
fi

SERVER="${VPS_USER:-root}@${VPS_HOST}"
REMOTE_DIR="${VPS_PATH:-/var/www/chuchurex-api}"

echo "🚀 Iniciando despliegue a producción..."
echo "   Servidor: $SERVER"
echo "   Directorio: $REMOTE_DIR"
echo ""

# 1. Subir backend unificado como app.py
echo "📤 Subiendo app_unified.py como app.py..."
scp app_unified.py $SERVER:$REMOTE_DIR/app.py

# 2. Subir directorio pdf-generator (sin node_modules)
echo "📤 Subiendo pdf-generator/..."
ssh $SERVER "mkdir -p $REMOTE_DIR/pdf-generator"
scp pdf-generator/generate-pdf-api.js $SERVER:$REMOTE_DIR/pdf-generator/
scp pdf-generator/package.json $SERVER:$REMOTE_DIR/pdf-generator/

# 3. Crear directorios necesarios en el servidor
echo "📁 Creando directorios..."
ssh $SERVER "mkdir -p $REMOTE_DIR/proposals $REMOTE_DIR/chats"

# 4. Instalar dependencias de Node en el servidor
echo "📦 Instalando dependencias de Node.js..."
ssh $SERVER "cd $REMOTE_DIR/pdf-generator && npm install --production"

# 5. Reiniciar el servicio
echo "🔄 Reiniciando servicio chuchurex..."
ssh $SERVER "systemctl restart chuchurex"

# 6. Verificar estado
echo ""
echo "✅ Verificando estado del servicio..."
ssh $SERVER "systemctl status chuchurex --no-pager | head -15"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ DESPLIEGUE COMPLETADO"
echo "  🌐 API: https://api.chuchurex.cl"
echo "  📊 Chats: https://api.chuchurex.cl/chats?key=\${CHATS_ACCESS_KEY}"
echo "═══════════════════════════════════════════════════════════════"
