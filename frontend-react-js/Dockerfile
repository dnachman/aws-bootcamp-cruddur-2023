FROM node:16.18

ENV PORT=3000

WORKDIR /frontend-react-js

# copy package and run npm install so it's own layer since this wont change as often as code
COPY package.json .
RUN npm install

COPY . .

EXPOSE ${PORT}

CMD ["npm", "start"]
