## Game Architecture

As a hobby project, I have been putting together some technologies that may help beginner game developers with
constructing multiplayer games.

Want to contribute or get more information about this project?
https://join.slack.com/t/gamearch/shared_invite/zt-cfa97f7n-x_6q6ndOAlFYkZf7xtT82Q

### Technologies Used
- Typescript for everything
    - https://www.typescriptlang.org/docs/home.html
- NestJS 
    - https://docs.nestjs.com/
    - REST and Websocket MVC
- Socket.IO 
    - https://socket.io/docs/
    - Websocket library to communicate
- TypeORM 
    - https://typeorm.io/
    - Using MySQL as the driver
- NATS 
    - https://docs.nats.io/
    - As the microservice communication method
    - Currently requires little-to-no knowledge of the technology outside of setting up credentials
    - Using this as the communication method eliminates the need to use Socket.IO-redis
    - Peer to Peer communication goes through the appropriate microservice (chat, map movements, etc)
- Phaser 
    - http://phaser.io/learn
    - Running on server for physics parity and validation ONLY
    - client side is not restricted
- Angular
    - https://angular.io/docs
    - https://material.angular.io/components/categories
    - Using Angular Material for UI construction
    - Using Dependency Injection to aide in constructing larger scale projects
- MySQL
    - Used to persist data on a microservice.
- PM2
    - https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/
    - Multi-process orchestration (not dockerized at the moment)

### The Idea

Using microservices as a way to separate responsibilities of an application helps developers understand how to
scale (not just for games).
By splitting up each responsibility into its own fully autonomous application, it allows other aspects of
the system to go down without affecting said microservice. 
The only bottle necks of communication at this point becomes the gateways and REST controllers that the end users
must connect to.
