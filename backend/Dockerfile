FROM node:22

WORKDIR /projects/coffee/backend/

COPY ./package*.json ./

RUN npm install

COPY ./ ./

EXPOSE 30010

CMD ["npm", "run", "start:dev"]