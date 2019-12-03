start:
	make delete || echo "no process found"
	pm2 start --kill-timeout 5000

stop:
	pm2 stop ecosystem.config.js

restart:
	pm2 reload ecosystem.config.js --kill-timeout 5000

delete:
	pm2 delete ecosystem.config.js
