## Game Architecture

As a hobby project, I have been putting together some technologies that may help beginner game developers with
constructing multiplayer games.

![](https://github.com/jwhenry3/game-architecture/blob/master/microservice-game-architecture.png?raw=true)

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
    - Using SQLite as the driver
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
- SQLite
    - Used to persist data on a microservice.
    - Originally was using MySQL but that may be used down the road for data backups only.
    - SQLite provides the data architecture that MySQL provides without the network overhead
    - DB files are stored under `server/db` for easy tracking and management
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

### Global Services

- Lobby (1+ instances)
    - Entry point for a user to discover world servers
    - Login/Register is exposed here
- Presence (1 instance should only be needed)
    - World Server Discovery
    - When a world comes online or goes offline, the Presence service will be updated
- Account (1+ instances)
    - To register, login, and verify a user has access to the system

### World Instance Services

- Item (1+ instances)
    - Handles items that would be accessible to a world and a character's inventory
    - If an item does not exist here, it should not be respected anywhere
    - Items can be associated with a quest once mechanics are built for it
- Quest (1+ instances)
    - Handles quest requirements and rewards
    - requirements could be of a multitude of requirement types once defined
    - rewards would come in the form of currency, item ID and quantity, or EXP of some kind
- Chat (1+ instances)
    - Handles any communication end users may want to send to other users
    - (Other services will be created to handle more long-term communication in the future)
- Character (1+ instances)
    - Handles character-to-account association
    - To create, sign in, get info on, and sign out of characters
- Commerce (1+ instances)
    - Handles trade interactions
    - Handles marketplace/auction-like interactions
- Map (1 instance per map)
    - Handles NPC position, movement, and respawn
    - Handles Resource position and respawn
    - Handles movement actions using Phaser Arcade Physics
    - Handles transitions between maps based on a character's movement
    - Handles In-Range checks against other players, resources, NPCs
    - Handles optional quest progress in regions of a map
    - A single instance is used per map.
        - If you need 10 maps, you need 10 instances with different configurations per map
        - This is due to a restriction to headless Phaser and to help keep operations on different threads when possible
- Server (1+ instances)
    - Handles all traffic from a client Websocket connection
    - Authenticates the socket using a JWT against the Account service
    - Verifies character selections against the Character service
    - Propagates events to responsible services to handle micro-interactions outside of the current thread if possible
    - Handles events sent from services that are intended to report something to the end-user

### Current Progress
- Presence
    - World Presence is handled by the Presence microservice
    - Character Presence is handled by the Character microservice
- Authentication
    - Register with Email
    - Login with Email
- World Selection
    - Worlds connected to the appropriate NATS server will auto-register upon running
    - Worlds will be marked offline after the server goes down
- Characters
    - Character Creation (name and gender)
    - Character Selection
- Map
    - 1 Map so far
    - Player input (movement directions) are sent to server
    - The server broadcasts the connected users on the map at a given interval (id, name, x, y, movement directions)
    - Velocity is calculated upon an input event and upon receiving the list of players
    - No NPCs at this time (will be implemented on the map server directly, not with another microservice)
