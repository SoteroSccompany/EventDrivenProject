# Use uma imagem base do Node.js
FROM node:18

# Define o diretório de trabalho no container
WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd


# Copia o package.json e package-lock.json para instalar as dependências primeiro
COPY package*.json ./


# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos para o container
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Expõe a porta onde o aplicativo será executado
EXPOSE 3003

# Comando para iniciar o aplicativo
CMD ["npm", "start"]

# CMD ["tail", "-f", "/dev/null"]
