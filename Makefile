install:
	cd game-clients && npm i
	cd game-servers && npm i
	cd game-servers && npm run build

start:
	cd game-clients && make start
	cd game-servers && make start
	cd game-servers && WORLD_NAME=Talos WORLD_CONSTANT=talos make start-world

delete:
	cd game-clients && make delete
	cd game-servers && make delete
	cd game-servers && WORLD_NAME=Talos WORLD_CONSTANT=talos make delete-world

fixtures:
	cd game-servers && WORLD_NAME=Talos WORLD_CONSTANT=talos npm run fixtures:map
