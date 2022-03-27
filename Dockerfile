FROM node:16

WORKDIR /usr/src/smartbrainapi

COPY ./ ./

RUN npm install

CMD [ "/bin/bash" ]