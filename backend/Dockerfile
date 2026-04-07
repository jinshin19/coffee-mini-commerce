FROM node:22

WORKDIR /projects/coffee/backend/

COPY ./package*.json ./

RUN npm install

COPY ./ ./

CMD ["NODE_ENV=production", "npm", "run", "start:dev"]