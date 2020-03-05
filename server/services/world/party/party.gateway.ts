import {SubscribeMessage, WebSocketGateway, WebSocketServer}                                from "@nestjs/websockets";
import {AllPlayers, PlayerEnteredMap, PlayerLeftMap, PlayerDirectionalInput, PlayerUpdate}  from "../../map/actions";
import {WorldService}                                                                       from "../world.service";
import {WorldConstants}                                                                     from "../../../lib/constants/world.constants";
import {Repository}                                                                         from "typeorm";
import {Player}                                                                             from "../entities/player";
import {InjectRepository}                                                                   from "@nestjs/typeorm";
import {Namespace, Socket}                                                                  from "socket.io";
import {MapClient}                                                                          from "../../map/client/map.client";
import * as parser
                                                                                            from "socket.io-msgpack-parser";
import {CreateParty, MakePartyLeader, PartyCreated, PartyLeaderNotChanged, PartyNotCreated} from "../../party/actions";
import {PartyClient}                                                                        from "../../party/client/party-client.service";

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT,
    parser
})
export class PartyGateway {
    @WebSocketServer()
    server: Namespace;

    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        private client: PartyClient
    ) {

    }

    @SubscribeMessage(CreateParty.event)
    async createParty(client: Socket, data: CreateParty) {
        try {
            let party = await this.client.createParty(data.partyName, data.characterId)
            if (party) {
                client.emit(PartyCreated.event, new PartyCreated(party.id, data.characterId))
                client.join('party.' + data.partyName)
            }
        } catch (e) {
            client.emit(PartyNotCreated.event, new PartyNotCreated({statusCode: 409}))
        }
    }

    @SubscribeMessage(MakePartyLeader.event)
    async makeLeader(client: Socket, data: MakePartyLeader) {
        try {
            let party = await this.client.getPartyByLeader(data.leaderId)
            if (party) {
                await this.client.makeLeader(data.leaderId, data.characterId)
                return;
            }
            client.emit(PartyLeaderNotChanged.event)
        } catch (e) {
            client.emit(PartyLeaderNotChanged.event)
        }
    }
}
