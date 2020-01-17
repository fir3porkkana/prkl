FROM node:12

# Set timezone to Europe/Helsinki
RUN echo "Europe/Helsinki" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

WORKDIR /usr/src/app
COPY . .

WORKDIR /usr/src/app/server

EXPOSE 3001

RUN npm i -g nodemon
CMD nodemon
