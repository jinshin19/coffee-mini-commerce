FROM node:22

WORKDIR /projects/coffee/frontend-coffee/

COPY ./package*.json ./

RUN npm install

COPY ./ ./

EXPOSE 3000

CMD ["npm", "run", "dev"]