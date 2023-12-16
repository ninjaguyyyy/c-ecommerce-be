###################
# INSTALL DEPENDENCIES
###################
FROM node:18-alpine As deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn prisma generate
RUN yarn run build

###################
# PRODUCTION
###################

FROM node:18-alpine As production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3300

CMD [ "node", "dist/src/main" ]
