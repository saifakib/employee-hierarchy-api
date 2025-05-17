# Development stage
FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=development /app/dist ./dist
COPY --from=development /app/public ./public
EXPOSE 3000
CMD ["node", "dist/main.js"]