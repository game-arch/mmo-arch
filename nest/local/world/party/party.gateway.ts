import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { WorldConstants }                                      from '../../../lib/constants/world.constants'
import { Repository }                                          from 'typeorm'
import { Player }                                              from '../entities/player'
import { InjectRepository }                                    from '@nestjs/typeorm'
import { Namespace, Socket }                                   from 'socket.io'
import * as parser                                             from 'socket.io-msgpack-parser'
import {
    CreateParty,
    MakePartyLeader,
    PartyCreated,
    PartyLeaderNotChanged,
    PartyNotCreated
}                                                              from '../../../../shared/actions/party.actions'
import { PartyClient }                                         from '../../party/client/party-client.service'

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT,
    parser
})
export class PartyGateway {
    @WebSocketServer()
    server: Namespace

    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        private client: PartyClient
    ) {

    }

    @SubscribeMessage(CreateParty.type)
    async createParty(client: Socket, data: CreateParty) {
        try {
            const party = await this.client.createParty(data.partyName, data.characterId)
            if (party) {
                client.emit(PartyCreated.type, new PartyCreated(party.id, data.characterId))
                client.join('party.' + data.partyName)
            }
        } catch (e) {
            client.emit(PartyNotCreated.type, new PartyNotCreated({ statusCode: 409 }))
        }
    }

    @SubscribeMessage(MakePartyLeader.type)
    async makeLeader(client: Socket, data: MakePartyLeader) {
        try {
            const party = await this.client.getPartyByLeader(data.leaderId)
            if (party) {
                await this.client.makeLeader(data.leaderId, data.characterId)
                return
            }
            client.emit(PartyLeaderNotChanged.type)
        } catch (e) {
            client.emit(PartyLeaderNotChanged.type)
        }
    }
}
