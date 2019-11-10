redis:
	sudo service redis-server restart

start:
	make stop || echo "no process found"
	make delete || echo "no process found"
	PORT=3000 SERVER_TYPE=lobby pm2 start --name "game-lobby" npm -- run start:dev
	PORT=3001 SERVER_TYPE=account pm2 start --name "game-account" npm -- run start:dev
	PORT=3002 SERVER_TYPE=register pm2 start --name "game-register" npm -- run start:dev
	PORT=3003 SERVER_TYPE=map pm2 start --name "game-map" npm -- run start:dev
	PORT=3004 SERVER_TYPE=shard pm2 start --name "game-shard" -i 4 npm -- run start:dev

stop:
	pm2 stop game-lobby
	pm2 stop game-account
	pm2 stop game-register
	pm2 stop game-map
	pm2 stop game-shard

restart:
	pm2 restart game-lobby
	pm2 restart game-account
	pm2 restart game-register
	pm2 restart game-map
	pm2 restart game-shard

delete:
	pm2 delete game-lobby
	pm2 delete game-account
	pm2 delete game-register
	pm2 delete game-map
	pm2 delete game-shard
