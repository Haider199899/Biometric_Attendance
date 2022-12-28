FROM node:18.12.1
WORKDIR /app 
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
EXPOSE 3000
COPY . .
CMD [ "npm", "run", "start" ]