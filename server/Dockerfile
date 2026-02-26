FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --only=production

COPY . .

ENV PORT=3782

EXPOSE 3782

CMD ["npm", "start"]

