#!/usr/bin/env bash
wget https://github.com/nats-io/nats-server/releases/download/v2.0.0/nats-server-v2.0.0-linux-amd64.zip
unzip nats-server-v2.0.0-linux-amd64.zip -d nats-server
sudo cp nats-server/nats-server-v2.0.0-linux-amd64/nats-server /usr/bin
rm nats-server-v2.0.0-linux-amd64.zip
rm -rf ./nats-server
