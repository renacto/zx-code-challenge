FROM node:boron

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
#COPY package.json .

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]