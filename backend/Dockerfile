# multistage
FROM node:20-alpine

# create and set directory
WORKDIR /                           

# install dependencies
COPY package.json ./
COPY prisma ./prisma/
RUN npm install
RUN npm run prisma:generate
# Copy the rest of the application files to the container
COPY . .
CMD [ "npm", "start" ]