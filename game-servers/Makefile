redis:
	sudo service redis-server restart

start:
	make delete || echo "no process found"
	pm2 start

stop:
	pm2 stop all

restart:
	pm2 reload all

delete:
	pm2 delete all
