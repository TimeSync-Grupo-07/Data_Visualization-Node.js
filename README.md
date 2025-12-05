# Timesync Frontend — Load Balancer com Nginx + Node.js

Este repositório contém uma estrutura completa para executar um frontend Node.js estático, escalado em dois containers, com Nginx atuando como balanceador de carga.
O objetivo é garantir alta disponibilidade, distribuição de tráfego entre instâncias e configuração dinâmica de ambiente para consumo da API.

## Tecnologias Utilizadas

- Node.js + Express para servir o frontend.
- dotenv para injeção dinâmica de variáveis no navegador.
- Nginx como load balancer.
- Docker + Docker Compose para subir toda a infraestrutura.
- Bootstrap como base visual (contida em ```/template``` e ajustada em ```/app```).

## Estrutura do Projeto

```text
.
├── app/                      # Frontend final servido ao navegador
├── template/                 # Template Bootstrap base
├── server.js                 # Servidor Express + configuração dinâmica
├── nginx.conf                # Load balancer + proxy reverso
├── Dockerfile                # Build do container frontend
├── docker-compose.yml        # Orquestração dos containers
└── package.json
```

## Como Funciona o Load Balancer

A configuração do ```nginx.conf``` distribui o tráfego entre os containers:

    ```makefile
    frontend1:3001
    frontend2:3002
    ```

O bloco ```upstream``` define o cluster:

    ```nginx
    upstream frontend_cluster {
    server frontend1:3001;
    server frontend2:3002;
    }
    ```

Toda requisição comum vai para esse cluster:

    ```nginx
    location / {
    proxy_pass http://frontend_cluster;
    }
    ```

A rota ```/api/``` é redirecionada para sua API real, alterável conforme o ambiente:

    ```nginx
    proxy_pass http://10.0.1.204/api/;
    ```

## Como Subir o ambiente

1. Subir tudo via docker compose 

```docker
docker compose up -d --build
```

2. Acessar o sistema

```ardunio
http://localhost
```

O Nginx automaticamente distribuirá as requisições entre ```frontend1``` e ```frontend2```.

## Portas Utilizadas

| Serviço   | Porta interna | Porta externa       |
| --------- | ------------- | ------------------- |
| frontend1 | 3001          | (exposed, sem bind) |
| frontend2 | 3002          | (exposed, sem bind) |
| Nginx     | 80            | 80                  |