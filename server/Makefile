install:
	cd game-servers && npm i --ignore-scripts
	cd game-clients && npm i --ignore-scripts
	sudo npm i -g pm2

start:
	pm2 start builders.config.js --kill-timeout 5000
	pm2 start services.config.js --kill-timeout 5000

stop:
	pm2 stop builders.config.js
	pm2 stop services.config.js

restart:
	pm2 reload builders.config.js --kill-timeout 5000
	pm2 reload services.config.js --kill-timeout 5000

delete:
	pm2 delete builders.config.js
	pm2 delete services.config.js

