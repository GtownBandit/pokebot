FROM node:22-alpine AS build
RUN npm install -g pnpm
WORKDIR /app
ENV CI=true

# Copy all monorepo files
COPY . .

# Install all dependencies for all workspaces at once
RUN pnpm install

# Generate prisma client if needed (for shared types)
RUN pnpm --filter backend exec prisma generate

# Build the frontend
RUN pnpm --filter frontend run build --configuration production

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/apps/frontend/dist/frontend/browser /usr/share/nginx/html
COPY /apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
