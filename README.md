## Game Architecture

As a hobby project, I have been putting together some technologies that may help beginner game developers with
constructing multiplayer games.

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
- Phaser 
    - http://phaser.io/learn
    - Running on server for physics parity and validation ONLY
    - client side is not restricted
- Angular
    - https://angular.io/docs
    - https://material.angular.io/components/categories
    - Using Angular Material for UI construction
    - Using Dependency Injection to aide in constructing larger scale projects
- NGXS
    - https://www.ngxs.io/
    - State Management system for Angular
    - Responsible for Authentication State only at this time

### The Idea

Using microservices as a way to separate responsibilities of an application helps developers understand how to
scale (not just for games).
By splitting up each responsibility into its own fully autonomous application, it allows other aspects of
the system to go down without affecting said microservice. 
The only bottle necks of communication at this point becomes the gateways and REST controllers that the end users
must connect to.

### Global Services
(*) - Can be changed to be per world, but it is global for now until that level of customization is more important

- Lobby
    - Entry point for a user to discover world servers
    - Login/Register is exposed here
- Presence
    - World Server Discovery
    - When a world comes online or goes offline, the presence microservice will be updated
- Account
    - To register, login, and verify a user has access to the system
- Character *
    - Handles character-to-account association
    - To create, sign in, and sign out of characters per world
- Chat *
    - Handles any communication end users may want to send to other users
    - (Other microservices will be created to handle more long-term communication in the future)
- Item *
    - Handles items that would be accessible to a world and a character's inventory
    - If an item does not exist here, it should not be respected anywhere
    - Items can be associated with a quest once mechanics are built for it
    - Currently global, so world instances do not have to manage this
- Quest *
    - Handles quest requirements and rewards
    - requirements could be of a multitude of requirement types once defined
    - rewards would come in the form of currency, item ID and quantity, or EXP of some kind

### World Instance Services

- Commerce (any number of instances can be run)
    - Handles trade interactions
    - Handles marketplace/auction-like interactions
- Map (single instance per map)
    - Handles NPC position, movement, and respawn
    - Handles Resource position and respawn
    - Handles movement actions using Phaser Arcade Physics
    - Handles transitions between maps based on a character's movement
    - Handles In-Range checks against other players, resources, NPCs
    - Handles optional quest progress in regions of a map
    - A single microservice instance is used per map.
        - If you need 10 maps, you need 10 instances with different configurations per map
        - This is due to a restriction to headless Phaser and to help keep operations on different threads when possible
- Server (running in cluster mode to scale vertically)
    - Handles all traffic from a client Websocket connection
    - Authenticates the socket using a JWT provided by the account microservice through the Lobby Server
    - Verifies character selections against the Character microservice
    - Propagates events to responsible microservices to handle micro-interactions outside of the current thread if possible
    - Handles events sent from microservices that are intended to report something to the end-user
