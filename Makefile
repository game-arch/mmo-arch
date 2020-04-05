install:
	make copy-environment
	npm i --ignore-scripts
	sudo npm i -g pm2
	npm run build:server

copy-environment:
	cp -n ./angular/game/src/environments/environment.sample.ts ./angular/game/src/environments/environment.ts

start:
	pm2 start client.config.js
	pm2 start builders.config.js --kill-timeout 5000
	pm2 start global.config.js --kill-timeout 5000

stop:
	pm2 stop client.config.js
	pm2 stop builders.config.js
	pm2 stop global.config.js

restart:
	pm2 reload client.config.js
	pm2 reload builders.config.js --kill-timeout 5000
	pm2 reload global.config.js --kill-timeout 5000

delete:
	pm2 delete client.config.js
	pm2 delete builders.config.js
	pm2 delete global.config.js

build:
	npm run build:client
	docker-compose build
	docker-compose -f docker-compose.build.yml build --no-cache

global-up:
	docker-compose -f docker-compose.global.yml up
global-down:
	docker-compose -f docker-compose.global.yml down

world-up:
	docker-compose -f docker-compose.world.yml up
world-down:
	docker-compose -f docker-compose.world.yml down


prune:
	npm run prune:worlds
	WORLD_CONSTANT=talos npm run prune:characters

offline:
	WORLD_CONSTANT=talos npm run offline:characters
	npm run offline:worlds

build-client:
	npm run build
	docker-compose build

nats:
	nats-server -p 4222 -m 8222 &
	nats-server -p 4223 -m 8223 &

docker-client:
	docker-compose -f docker-compose.client.yml up
docker-global:
	make global-up
docker-world:
	make world-up

start-maiden:
	WORLD_PORT=3006 pm2 start world.config.js --kill-timeout 5000
stop-maiden:
	pm2 stop world.config.js
delete-maiden:
	pm2 delete world.config.js

start-talos:
	WORLD_NAME=Talos WORLD_CONSTANT=talos WORLD_PORT=3006 pm2 start world.config.js --kill-timeout 5000
restart-talos:
	WORLD_NAME=Talos WORLD_CONSTANT=talos pm2 restart world.config.js
stop-talos:
	WORLD_NAME=Talos WORLD_CONSTANT=talos pm2 stop world.config.js
delete-talos:
	WORLD_NAME=Talos WORLD_CONSTANT=talos pm2 delete world.config.js
