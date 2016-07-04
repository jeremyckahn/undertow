#!/bin/bash

COMMAND=$1
BIN="./node_modules/.bin"

export PATH=$BIN:$PATH

case "$COMMAND" in
  start )
    node ./bin/www
  ;;

  start:debug )
    nodemon \
      --watch "*.js" \
      --watch routes \
      --watch models \
      --exec "DEBUG=undertow:* npm start"
  ;;

  test )
    mocha --recursive
  ;;

  test:watch )
    mocha --recursive --watch
  ;;
esac
