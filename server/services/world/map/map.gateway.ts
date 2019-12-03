import {SubscribeMessage, WebSocketGateway, WebSocketServer}                 from "@nestjs/websockets";
import {Namespace, Server, Socket}                                           from "socket.io";
import {AllPlayers, PlayerEnteredMap, PlayerLeftMap, PlayerDirectionalInput} from "../../map/actions";
import {MapClient}                                                           from "../../map/client/map.client";
import {WorldService}                                                        from "../world.service";
import {WorldConstants}                                                      from "../../../lib/constants/world.constants";
import {RedisNamespace}                                                      from "../redis.namespace";
import {RedisSocket}                                                         from "../redis.socket";
import {CharacterClient}                                                     from "../../character/client/character.client";

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT
})
export class MapGateway {
    @WebSocketServer()
    server: RedisNamespace;

    constructor(
        private service: WorldService,
        private map: MapClient,
        private character: CharacterClient
    ) {

    }

    async playerJoin(data: PlayerEnteredMap) {
        let character = await this.character.getCharacter(data.characterId);
        if (character && character.socketId) {
            if (this.service.characters[character.id]) {
                this.service.characters[character.id].socket.join('map.' + data.map);
            } else {
                this.server.adapter.add(character.socketId, 'map.' + data.map);
            }
            this.server.to('map.' + data.map).emit(PlayerEnteredMap.event, data);
        }
    }

    async playerLeave(data: PlayerLeftMap) {
        let character = await this.character.getCharacter(data.characterId);
        if (character && character.socketId) {
            this.server.to('map.' + data.map).emit(PlayerLeftMap.event, data);
            if (this.service.characters[character.id]) {
                this.service.characters[character.id].socket.leave('map.' + data.map);
            } else {
                this.server.adapter.del(character.socketId, 'map.' + data.map);
            }
        }
    }

    allPlayers(data: AllPlayers) {
        this.server.to('map.' + data.map).emit(AllPlayers.event, data.players);
    }

    @SubscribeMessage(PlayerDirectionalInput.event)
    playerDirectionalInput(client: RedisSocket, data: { directions: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        this.service.playerDirectionalInput(client, data);
    }
}
