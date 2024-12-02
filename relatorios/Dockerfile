# Use uma imagem base do Node.js
FROM node:18

# Atualiza o repositório e instala o cliente MySQL
RUN apt-get update && \
    apt-get install -y default-mysql-client && \
    rm -rf /var/lib/apt/lists/*

# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e instale dependências
COPY package*.json ./
RUN npm install --production

# Copie o código-fonte
COPY . .

# Exponha a porta 4000
EXPOSE 4000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
