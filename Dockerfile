# Property Of @FXastro

FROM debian:bullseye-slim

ENV NODE_VERSION 20.16.0

RUN apt-get update && \
    apt-get install -y \
    curl \
    git \
    ffmpeg \
    webp && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

RUN npm install -g yarn

RUN git clone https://github.com/FXastro/fxop-md.git /root/bot
WORKDIR /root/bot
RUN yarn install
CMD ["yarn", "start"]
