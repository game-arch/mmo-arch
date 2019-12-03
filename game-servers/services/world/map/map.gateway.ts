import {SubscribeMessage, WebSocketGateway, WebSocketServer}                 from "@nestjs/websockets";
import {Server, Socket}                                                      from "socket.io";
import {AllPlayers, PlayerEnteredMap, PlayerLeftMap, PlayerDirectionalInput} from "../../map/actions";
import {MapClient}                                                           from "../../map/client/map.client";
import {WorldService}                                                        from "../world.service";
import {WorldConstants}                                                      from "../../../lib/constants/world.constants";

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT
})
export class MapGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private service: WorldService,
        private map: MapClient
    ) {

    }

    playerJoin(data: PlayerEnteredMap) {
        if (this.service.characters.hasOwnProperty(data.characterId)) {
            this.service.characters[data.characterId].character.map = data.map;
            this.service.characters[data.characterId].socket.join('map.' + data.map);
        }
        this.server.to('map.' + data.map).emit(PlayerEnteredMap.event, data);
    }

    playerLeave(data: PlayerLeftMap) {
        this.server.to('map.' + data.map).emit(PlayerLeftMap.event, data);
        if (this.service.characters[data.characterId]) {
            this.service.characters[data.characterId].character.map = '';
            this.service.characters[data.characterId].socket.leave('map.' + data.map);
        }
    }

    allPlayers(data: AllPlayers) {
        this.server.to('map.' + data.map).emit(AllPlayers.event, data.players);
    }

    @SubscribeMessage(PlayerDirectionalInput.event)
    playerDirectionalInput(client: Socket, data: { directions: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        this.service.playerDirectionalInput(client, data);
    }
}
