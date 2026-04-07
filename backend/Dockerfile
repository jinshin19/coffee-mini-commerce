FROM node:22

WORKDIR /projects/coffee/backend/

COPY ./package*.json ./
RUN npm install

COPY ./ ./

RUN npm run build

ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]