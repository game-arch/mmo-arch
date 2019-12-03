install:
	cd game-servers && npm i --ignore-scripts
	cd game-clients && npm i --ignore-scripts
	sudo npm i -g pm2

start:
	pm2 start builders.config.js
	pm2 start services.config.js

stop:
	pm2 stop builders.config.js
	pm2 stop services.config.js

restart:
	pm2 reload builders.config.js
	pm2 reload services.config.js

delete:
	pm2 delete builders.config.js
	pm2 delete services.config.js

