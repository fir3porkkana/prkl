# Cypress e2e testing environment
FROM cypress/browsers:node10.16.0-chrome77

COPY e2e/package.json e2e/package-lock.json /tmp/
WORKDIR /tmp
RUN CI=true npm ci
RUN CI=true /tmp/node_modules/.bin/cypress install
RUN mkdir /e2e && cp -a /tmp/node_modules /e2e/

WORKDIR /e2e
COPY e2e/cypress.json /e2e

CMD ["./node_modules/.bin/cypress", "run"]
