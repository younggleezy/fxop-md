FROM node:18.16.0-bullseye-slim

RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    webp && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/FXastro/fx-md.git /root/bot
WORKDIR /root/bot
RUN yarn install
CMD ["node", "index.js"]
