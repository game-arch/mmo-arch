import {SubscribeMessage, WebSocketGateway, WebSocketServer}                               from "@nestjs/websockets";
import {AllPlayers, PlayerEnteredMap, PlayerLeftMap, PlayerDirectionalInput, PlayerUpdate} from "../../map/actions";
import {WorldService}                                                                      from "../world.service";
import {WorldConstants}                                                                    from "../../../lib/constants/world.constants";
import {Repository}                                                                        from "typeorm";
import {Player}                                                                            from "../entities/player";
import {InjectRepository}                                                                  from "@nestjs/typeorm";
import {Namespace, Socket}                                                                 from "socket.io";
import {MapClient}                                                                         from "../../map/client/map.client";
import * as parser from "socket.io-msgpack-parser";

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT,
    parser
})
export class MapGateway {
    @WebSocketServer()
    server: Namespace;

    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        private service: WorldService,
        private map: MapClient
    ) {

    }

    async playerJoin(data: PlayerEnteredMap) {
        let player = await this.players.findOne({characterId: data.characterId});
        this.server.to('map.' + data.map).emit(PlayerEnteredMap.event, data);
        if (player) {
            this.server.sockets[player.socketId].join('map.' + data.map);
            this.server.sockets[player.socketId].emit(AllPlayers.event, await this.map.getAllPlayers(data.map));
        }
    }

    async playerLeave(data: PlayerLeftMap) {
        this.server.to('map.' + data.map).emit(PlayerLeftMap.event, data);
        let player = await this.players.findOne({characterId: data.characterId});
        if (player) {
            this.server.sockets[player.socketId].leave('map.' + data.map);
        }
    }

    allPlayers(data: AllPlayers) {
        this.server.to('map.' + data.map).emit(AllPlayers.event, data.players);
    }

    @SubscribeMessage(PlayerDirectionalInput.event)
    async playerDirectionalInput(client: Socket, data: { directions: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        await this.service.playerDirectionalInput(client, data);
    }
}
