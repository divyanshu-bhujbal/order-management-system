# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first to maximize layer cache hits.
COPY package*.json ./
RUN npm ci

# Copy source and build static assets.
COPY . .
RUN npm run build


FROM nginx:1.27-alpine AS runtime

# Remove default static content.
RUN rm -rf /usr/share/nginx/html/*

# Copy production nginx config and built assets.
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
