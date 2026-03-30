FROM node:22

WORKDIR /projects/coffee/backend/

COPY ./package*.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "run", "start:dev"]