FROM node:12-slim

RUN apt-get update && \
  apt-get install -y \
    libgtk2.0-0 \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    xvfb

# Install frontend dependencies
WORKDIR /usr/src/app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci

WORKDIR /usr/src/app
COPY client client/

WORKDIR /usr/src/app/client

CMD npm run cypress:test