FROM node:18

RUN apt-get update && \
    apt-get install -y default-mysql-client && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./  

RUN npm ci --production

COPY . .  

EXPOSE 3000

ENV NODE_ENV=production PORT=3000

CMD ["node", "server.js"]
