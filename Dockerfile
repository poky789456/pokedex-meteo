FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci --quiet || npm install --quiet
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine
RUN addgroup -S nodegrp && adduser -S nodeusr -G nodegrp
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER nodeusr
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=10 CMD node -e "require('http').get('http://localhost:3000/health',res=>process.exit(res.statusCode===200?0:1))"
CMD ["node", "dist/index.js"]
