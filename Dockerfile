FROM node:14-alpine

# working dir
WORKDIR /usr/src/app

# copy package json file
COPY package*.json ./

# install prettier
RUN npm i prettier -g

# install node modules
RUN npm i

# copy src files
COPY . .

# run build
RUN npm run build

# expose API port
EXPOSE 9090

# shell command run the app
CMD ["node", "build/server.js"]