#!/bin/sh
set -e

# Verifica se a variável API_URL está definida
if [ -z "${API_URL}" ]; then
    echo "❌ ERRO: API_URL não está definida!"
    echo "💡 Dica: Crie um arquivo .env com API_URL=http://seu-ip:porta"
    exit 1
fi

# Remove barra final se existir (para evitar dupla barra no proxy_pass)
export API_URL=${API_URL%/}

# Substitui variáveis no template
envsubst '${API_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

echo "✅ Nginx configurado com API_URL=${API_URL}"
echo "📁 Arquivos HTML sendo servidos de: /usr/share/nginx/html"

# Lista arquivos disponíveis (útil para debug)
echo "📄 Arquivos HTML disponíveis:"
find /usr/share/nginx/html -name "*.html" -exec basename {} \;

# Inicia o nginx
exec nginx -g 'daemon off;'