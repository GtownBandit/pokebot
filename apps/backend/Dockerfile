# backend/Dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder

RUN npm install -g pnpm
WORKDIR /app

# Copy root files
COPY /apps/backend ./apps/backend
COPY /package.json ./package.json
COPY /pnpm-lock.yaml ./pnpm-lock.yaml
COPY /pnpm-workspace.yaml ./pnpm-workspace.yaml

ENV CI=true
# Install all dependencies (including dev) for backend and its workspaces
RUN pnpm install --filter backend

RUN pnpm --filter backend exec prisma generate

# Build the backend (if needed)
RUN pnpm --filter backend run build


# Stage 2: Production
FROM node:22-alpine AS prod
RUN npm install -g pnpm
WORKDIR /app
#
## Copy only production dependencies and built files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
#
#EXPOSE 3000
CMD pnpm --filter backend exec prisma migrate deploy --schema=/app/apps/backend/prisma/schema.prisma && pnpm --filter backend run start:prod
