redis:
	sudo service redis-server restart

start:
	pm2 start builders.config.js
	pm2 start global.config.js

stop:
	pm2 stop builders.config.js
	pm2 stop global.config.js

restart:
	pm2 reload builders.config.js
	pm2 reload global.config.js

delete:
	pm2 delete builders.config.js
	pm2 delete global.config.js


start-world:
	pm2 start world.config.js

stop-world:
	pm2 stop world.config.js

delete-world:
	pm2 delete world.config.js
