redis:
	sudo service redis-server restart

start:
	make delete || echo "no process found"
	pm2 start

stop:
	pm2 stop ecosystem.config.js

restart:
	pm2 reload ecosystem.config.js

delete:
	make stop
	pm2 delete ecosystem.config.js
