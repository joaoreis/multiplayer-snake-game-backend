FROM node:18-alpine

ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL warn
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
