# backend/Dockerfile
FROM node:18-alpine AS build
WORKDIR /app

# copy package files first (cache)
COPY package*.json ./
RUN npm ci --production

# copy source
COPY . .

# runtime image
FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# create non-root user for safety
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# copy from build
COPY --from=build /app ./

EXPOSE 4000
USER appuser

# start the app (ensure "start" script exists in package.json)
CMD ["node", "server.js"]
