# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json bun.lockb ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 8080
CMD ["npm", "run", "preview", "--", "--port", "8080", "--host"]
