FROM node:19-alpine
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 8081
CMD ["sh", "-c", "npm run start:bot"]
