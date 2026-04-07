FROM node:22

WORKDIR /projects/coffee/frontend-admin/

COPY ./package*.json ./
RUN npm install

COPY ./ ./

RUN npm run build

CMD ["npm", "run", "start"]