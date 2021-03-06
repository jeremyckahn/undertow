#!/bin/bash

COMMAND=$1
BIN="./node_modules/.bin"
DB_FILE_LOCATION="./.db.json"

export PATH=$BIN:$PATH

case "$COMMAND" in
  start )
    node ./bin/www
  ;;

  start:debug )
    nodemon \
      --watch "app.js" \
      --watch "constant.js" \
      --watch routes \
      --watch models \
      --watch api \
      --exec "DEBUG=undertow:* npm start"
  ;;

  test )
    mocha --recursive
  ;;

  test:debug )
    mocha debug
  ;;

  test:watch )
    mocha --recursive --watch
  ;;

  use-data:basic )
    cp test/data/basic.json "$DB_FILE_LOCATION"
  ;;
esac
