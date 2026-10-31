# =============================================================================
# Stage 1 — Dependencies (Base layer for caching)
# =============================================================================
FROM node:22-alpine AS deps

WORKDIR /app

# Install dependencies first (layer-cached unless package.json/lock changes)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# =============================================================================
# Stage 2 — Development (Vite Dev Server with HMR)
# =============================================================================
FROM node:22-alpine AS development

WORKDIR /app

# Copy cached node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=development

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# =============================================================================
# Stage 3 — Builder (Compiles static assets for production)
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy cached node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN npm run build

# =============================================================================
# Stage 4 — Production Server (Lean Nginx Runtime)
# =============================================================================
FROM nginx:1.27-alpine AS production

# Remove default nginx static assets and config
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Expose HTTP port (Nginx listens on 80 inside the container)
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
