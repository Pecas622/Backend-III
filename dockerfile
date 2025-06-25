FROM node
WORKDIR /backend-III
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm","start"]