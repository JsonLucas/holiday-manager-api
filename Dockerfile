FROM node:18.17.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

# EXPOSE 5000

CMD ["npm", "start"]