FROM nginx:alpine

# Instala envsubst (para substituir variáveis no template)
RUN apk add --no-cache gettext

# Copia arquivos do site
COPY /src/public /usr/share/nginx/html

# Copia o template para o diretório correto do nginx
COPY nginx/nginx.conf.template /etc/nginx/templates/default.conf.template

# Copia e ajusta permissões do entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Define o entrypoint
ENTRYPOINT ["/entrypoint.sh"]