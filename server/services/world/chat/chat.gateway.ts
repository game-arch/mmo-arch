import {SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {WorldConstants}                                      from "../../../lib/constants/world.constants";
import {Server, Socket}                                      from "socket.io";
import {GameCharacter}                                       from "../../../lib/interfaces/game-character";
import {
    ErrorMessage,
    GlobalMessage,
    LocalMessage,
    PrivateMessage,
    RegionMessage,
    TradeMessage,
    ZoneMessage
}                                                            from "./actions";
import {MapClient}                                           from "../../map/client/map.client";
import {WorldService}                                        from "../world.service";
import {ClientProxy}                                         from "@nestjs/microservices";

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT
})
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private client: ClientProxy,
        private world: WorldService,
        private map: MapClient
    ) {

    }

    @SubscribeMessage(LocalMessage.event)
    async localMessage(client: Socket, message: string) {
        let character = this.world.sockets[client.id].character;
        if (character && character.map !== '') {
            let position = await this.map.getPlayer(character.id, character.map);
            this.client.emit(LocalMessage.event, new LocalMessage(character, character.map, position.x, position.y, message));
        }
    }

    @SubscribeMessage(ZoneMessage.event)
    zoneMessage(client: Socket, message: string) {
        let character = this.world.sockets[client.id].character;
        if (character && character.map !== '') {
            this.client.emit(ZoneMessage.event, new ZoneMessage(character, character.map, message));
        }
    }

    @SubscribeMessage(RegionMessage.event)
    regionMessage(client: Socket, message: string) {
        let character = this.world.sockets[client.id].character;
        if (character && character.map !== '') {
            this.client.emit(RegionMessage.event, new ZoneMessage(character, character.map, message));
        }
    }

    @SubscribeMessage(TradeMessage.event)
    tradeMessage(client: Socket, message: string) {
        let character = this.world.sockets[client.id].character;
        if (character && character.map !== '') {
            this.client.emit(TradeMessage.event, new TradeMessage(character, message));
        }
    }

    @SubscribeMessage(GlobalMessage.event)
    globalMessage(client: Socket, message: string) {
        let character = this.world.sockets[client.id].character;
        if (character && character.map !== '') {
            this.client.emit(GlobalMessage.event, new GlobalMessage(character, message));
        }
    }

    @SubscribeMessage(PrivateMessage.event)
    privateMessage(client: Socket, data: { to: GameCharacter, message: string }) {
        let character = this.world.sockets[client.id].character;
        if (character && character.map !== '') {
            let sent = false;
            this.client.emit(PrivateMessage.event, new PrivateMessage(character, data.to, data.message))
                .subscribe({
                    next(delivered) {
                        if (delivered) {
                            sent = true;
                        }
                    },
                    complete() {
                        if (!sent) {
                            client.emit(ErrorMessage.event, new ErrorMessage('Could not send private message to the specified user at this time.'));
                        }
                    }
                });
        }
    }
}
