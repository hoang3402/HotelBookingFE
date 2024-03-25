From dockerhub.zeabur.cloud/library/node:18node:18 AS builder

EXPOSE 3000

WORKDIR /src

RUN which corepack || npm install -g --force corepack@0.10.0

RUN corepack enable

COPY package.json* tsconfig.json* .npmrc* .

COPY yarn.lock* .

RUN yarn install

COPY . .

RUN yarn build

COPY --from=build /src /