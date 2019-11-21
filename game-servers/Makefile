redis:
	sudo service redis-server restart

start:
	pm2 start ecosystem.config.js

stop:
	pm2 stop ecosystem.config.js

restart:
	pm2 reload ecosystem.config.js

delete:
	pm2 delete ecosystem.config.js


start-microservices:
	pm2 start microservices.config.js

stop-microservices:
	pm2 stop microservices.config.js

restart-microservices:
	pm2 restart microservices.config.js

delete-microservices:
	pm2 delete microservices.config.js


start-servers:
	pm2 start servers.config.js

stop-servers:
	pm2 stop servers.config.js

restart-servers:
	pm2 restart servers.config.js

delete-servers:
	pm2 delete servers.config.js


start-builders:
	pm2 start builders.config.js

stop-builders:
	pm2 stop builders.config.js

restart-builders:
	pm2 restart builders.config.js

delete-builders:
	pm2 delete builders.config.js
