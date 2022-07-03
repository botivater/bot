# Build a Docker image of the NestJS application
# based on a NodeJS 16 image. The multi-stage mechanism
# allows to build the application in a "builder" stage
# and then create a lightweight production image
# containing the required dependencies and the JS build files.
FROM node:16-alpine as builder

ARG APP bot

# Set the node environment to build.
ENV NODE_ENV build

# Set the user to node and set the workdir to /home/node.
USER node
WORKDIR /home/node

# Copy the package file and clean install.
COPY package.json yarn.lock ./
RUN rm -rf node_modules && yarn install --frozen-lockfile

# Copy the source code.
COPY --chown=node:node . .

# Build the application and remove the dev dependencies.
RUN yarn build $APP && yarn install --frozen-lockfile --production

# ---

FROM node:16-alpine

ARG APP bot
ENV APP $APP

# Set the node environment to production.
ENV NODE_ENV production

# Expose port 3000
EXPOSE 3000

# Set the user to node and set the workdir to /home/node.
USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package.json ./
COPY --from=builder --chown=node:node /home/node/yarn.lock ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

# Run the startup script
CMD node dist/apps/${APP}/main.js
