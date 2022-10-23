FROM node:16.16.0


RUN mkdir -p /app
COPY . /app/
WORKDIR /app

Run npm install -g http-server
RUN npm install
RUN npm run build

CMD ["http-server", "dist"]