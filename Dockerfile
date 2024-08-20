# Property Of @FXastro

FROM fxastro/fx-patch:latest
RUN npm install -g yarn
RUN git clone https://github.com/FXastro/fx-md.git /root/bot
WORKDIR /root/bot
RUN yarn install
CMD ["yarn", "start"]
