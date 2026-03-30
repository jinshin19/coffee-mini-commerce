FROM node:22

WORKDIR /projects/coffee/frontend-coffee/

COPY ./package*.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "run", "dev"]