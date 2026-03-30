FROM node:22

WORKDIR /projects/coffee/frontend-admin/

COPY ./package*.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "run", "dev"]