FROM node:18.16.1

WORKDIR /app/resource_reservation_admin_ui

RUN chown -R node:node /app/resource_reservation_admin_ui

COPY package*.json ./

RUN npm install -f

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start"]