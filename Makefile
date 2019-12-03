install:
	cd client && npm i
	cd server && npm i
	cd server && npm run build

start:
	cd client && make start
	cd server && WORLD_NAME=Talos WORLD_CONSTANT=talos make start

delete:
	cd client && make delete
	cd server && WORLD_NAME=Talos WORLD_CONSTANT=talos make delete

fixtures:
	cd server && WORLD_NAME=Talos WORLD_CONSTANT=talos npm run fixtures:map
