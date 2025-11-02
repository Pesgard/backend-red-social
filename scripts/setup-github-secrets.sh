#!/bin/bash

# 🔐 Script para configurar GitHub Secrets
# Este script te ayuda a configurar todos los secrets necesarios para el deployment

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Configuración de GitHub Secrets para Dokploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar que gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) no está instalado"
    echo "📥 Instálalo con: brew install gh"
    echo "   O visita: https://cli.github.com/"
    exit 1
fi

# Verificar autenticación
if ! gh auth status &> /dev/null; then
    echo "🔑 No estás autenticado en GitHub CLI"
    echo "   Ejecuta: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI configurado correctamente"
echo ""

# Función para crear/actualizar secret
set_secret() {
    local name=$1
    local value=$2
    
    echo "🔒 Configurando secret: $name"
    echo "$value" | gh secret set "$name"
}

# Función para solicitar input con validación
ask_secret() {
    local name=$1
    local description=$2
    local default=$3
    local value
    
    echo ""
    echo "📝 $name"
    echo "   $description"
    
    if [ -n "$default" ]; then
        read -p "   Valor [$default]: " value
        value=${value:-$default}
    else
        read -p "   Valor: " value
    fi
    
    if [ -z "$value" ]; then
        echo "❌ El valor no puede estar vacío"
        ask_secret "$name" "$description" "$default"
        return
    fi
    
    echo "$value"
}

# Generar JWT Secret automáticamente si no se proporciona
generate_jwt_secret() {
    openssl rand -base64 32
}

echo "🚀 Configurando secrets para deployment..."
echo ""

# Docker Hub
DOCKHUB_USERNAME=$(ask_secret "DOCKHUB_USERNAME" "Tu usuario de Docker Hub" "")
DOCKHUB_PASSWORD=$(ask_secret "DOCKHUB_PASSWORD" "Tu Access Token de Docker Hub (no la contraseña)" "")

# Dokploy
DOKPLOY_URL=$(ask_secret "DOKPLOY_URL" "URL de tu API de Dokploy (ej: https://dokploy.tudominio.com/api)" "")
DOKPLOY_API_KEY=$(ask_secret "DOKPLOY_API_KEY" "Tu API Key de Dokploy" "")

# Application Secrets
echo ""
echo "🔐 Generando JWT_SECRET automáticamente..."
JWT_SECRET=$(generate_jwt_secret)
echo "   JWT_SECRET generado: ${JWT_SECRET:0:20}..."

CORS_ORIGIN=$(ask_secret "CORS_ORIGIN" "Origen permitido para CORS" "*")
MONGO_PASSWORD=$(ask_secret "MONGO_PASSWORD" "Contraseña para MongoDB" "")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 Subiendo secrets a GitHub..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Configurar todos los secrets
set_secret "DOCKHUB_USERNAME" "$DOCKHUB_USERNAME"
set_secret "DOCKHUB_PASSWORD" "$DOCKHUB_PASSWORD"
set_secret "DOKPLOY_URL" "$DOKPLOY_URL"
set_secret "DOKPLOY_API_KEY" "$DOKPLOY_API_KEY"
set_secret "JWT_SECRET" "$JWT_SECRET"
set_secret "CORS_ORIGIN" "$CORS_ORIGIN"
set_secret "MONGO_PASSWORD" "$MONGO_PASSWORD"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Todos los secrets configurados correctamente"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Resumen de configuración:"
echo "   • Docker Hub User: $DOCKHUB_USERNAME"
echo "   • Dokploy URL: $DOKPLOY_URL"
echo "   • CORS Origin: $CORS_ORIGIN"
echo "   • JWT Secret: ${JWT_SECRET:0:20}... (generado automáticamente)"
echo ""
echo "🚀 Próximos pasos:"
echo "   1. git add ."
echo "   2. git commit -m 'ci: configurar deployment a Dokploy'"
echo "   3. git push origin master"
echo ""
echo "   El workflow se ejecutará automáticamente y configurará todo en Dokploy"
echo ""
