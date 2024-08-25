FROM node:20-bullseye-slim
WORKDIR /bot
RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    chromium \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libasound2 \
    libgbm1 \
    libxss1 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libdbus-glib-1-2 \
    libdrm2 \
    libxkbcommon0 \
    libxrandr2 \
    libpango-1.0-0 \
    libcairo2 \
    libjpeg62-turbo \
    libpng16-16 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g npm@latest
RUN git clone https://github.com/FXastro/fxop-md .
RUN npm install
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
CMD ["npm", "start"]