# Use Node v7 as the base image.
FROM node:latest
MAINTAINER Louis Debraine <louisdebraine@gmail.com>

RUN npm install lab -g

# Add everything in the current directory to our image, in the 'app' folder.
ADD . /api

WORKDIR /api

# Install dependencies
RUN npm install

#EXPOSE 8000

# Run our app.
CMD ["npm", "start"]
