install:
	make copy-environment
	cd client && npm i
	cd server && npm i
	cd server && npm run build

copy-environment:
	cp -n ./client/projects/game/src/environments/environment.sample.ts ./client/projects/game/src/environments/environment.ts

start:
	cd client && make start
	cd server && WORLD_NAME=Talos WORLD_CONSTANT=talos make start
stop:
	cd client && make stop
	cd server && WORLD_NAME=Talos WORLD_CONSTANT=talos make stop
delete:
	cd client && make delete
	cd server && WORLD_NAME=Talos WORLD_CONSTANT=talos make delete


prune:
	cd server && npm run prune:worlds
	cd server && WORLD_CONSTANT=talos npm run prune:characters

offline:
	cd server && WORLD_CONSTANT=talos npm run offline:characters
	cd server && npm run offline:worlds

nats:
	nats-server -p 4222 &
	nats-server -p 4223 &

build:
	cd client && make build
	cd server && make build

docker-client:
	cd client && docker-compose up
docker-global:
	cd server && make global-up
docker-world:
	cd server && make world-up
