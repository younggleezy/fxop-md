# Property Of @FXastro

FROM fxastro/fx-patch:latest


RUN git clone https://github.com/FXastro/fxop-md /root/fx-md
WORKDIR /root/fx-md/
RUN yarn install --network-concurrency 1
CMD ["node", "index.js"]