# Use Node v7 as the base image.
FROM node:7
MAINTAINER Louis Debraine <louisdebraine@gmail.com>

RUN npm install lab nodemon -g

# Add everything in the current directory to our image, in the 'app' folder.
ADD . /worker

WORKDIR /worker

# Install dependencies
RUN npm install

# Run our app.
#CMD npm start
