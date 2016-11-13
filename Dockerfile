FROM node:7.1.0

RUN mkdir /src
WORKDIR /src

RUN apt-get update && apt-get install -y --no-install-recommends \
    vim-nox \
    && rm -rf /var/lib/apt/lists/*

RUN npm install yarn --global

ADD package.json package.json
ADD yarn.lock yarn.lock 
RUN yarn install --production

ADD . /src
EXPOSE 8080

CMD ["node", "/src/index.js"]
