#!/bin/bash

REPO="pofigizm/jsonus"

docker kill $(docker ps -q --filter ancestor=$REPO)
docker pull $REPO
docker run -d -p 80:8080 $REPO
