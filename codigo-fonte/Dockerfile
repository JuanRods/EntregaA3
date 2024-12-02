# Use uma imagem base do Node.js LTS
FROM node:18

# Atualiza o repositório e instala o cliente MySQL
RUN apt-get update && \
    apt-get install -y default-mysql-client && \
    rm -rf /var/lib/apt/lists/*

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos de configuração do npm primeiro (aproveitando o cache)
COPY package*.json ./  

# Instale as dependências usando npm ci para builds reprodutíveis
RUN npm ci --production

# Copie o restante do código da aplicação
COPY . .  

# Exponha a porta em que a aplicação será executada
EXPOSE 3000

# Configurar variáveis de ambiente padrão (opcional)
ENV NODE_ENV=production PORT=3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
