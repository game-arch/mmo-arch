import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
}                                                           from '@nestjs/websockets'
import { WorldService }                                     from './world.service'
import { ConflictException, Logger, OnApplicationShutdown } from '@nestjs/common'
import { PresenceClient }                                   from '../../global/presence/client/presence.client'
import { environment }                                      from '../../lib/config/environment'
import { WorldConstants }                                   from '../../lib/constants/world.constants'
import { CharacterClient }                                  from '../character/client/character.client'
import { CharacterOffline, ReceivedCharacters }             from '../../../shared/actions/character.actions'
import { InjectRepository }                                 from '@nestjs/typeorm'
import { Player }                                           from './entities/player'
import { getConnection, Repository }                        from 'typeorm'
import { Namespace, Socket }                                from 'socket.io'
import * as parser                                          from 'socket.io-msgpack-parser'

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT,
    parser
})
export class WorldGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection, OnApplicationShutdown {
    @WebSocketServer()
    server: Namespace
    serverId = null

    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        private logger: Logger,
        private service: WorldService,
        private presence: PresenceClient,
        private character: CharacterClient
    ) {

    }

    async afterInit(server: Namespace) {
        this.serverId = await this.presence.register(
            environment.servers.world.host,
            environment.servers.world.port,
            WorldConstants.CONSTANT,
            WorldConstants.NAME,
            parseInt(process.env.NODE_APP_INSTANCE)
        )
    }

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            if ((await this.players.count()) >= 100) {
                throw new Error('Server Limit Reached')
            }
            const user   = await this.service.authenticate(client)
            const player = await this.players.findOne({ accountId: user.id })
            if (player) {
                throw new ConflictException('User already logged in!')
            }
            await this.service.storeUser(client, user.id)
            client.emit(ReceivedCharacters.type, new ReceivedCharacters(await this.service.getCharacters(user.id)))
        } catch (e) {
            console.log(e)
            client.emit('connect-error', e.message)
            client.disconnect(true)
        }
    }

    async handleDisconnect(client: Socket) {
        try {
            await this.service.removePlayer(client)
        } catch (e) {
            this.logger.error(e)
        }
    }

    async onApplicationShutdown(signal?: string) {
        this.service.shuttingDown = true
        let connection            = await getConnection().connect()
        const sockets             = await connection.query('select socketId from player where instance = ?', [process.env.NODE_APP_INSTANCE])
        await this.character.allCharactersOffline(sockets.map(player => (new CharacterOffline(player.socketId))))
        await connection.query('DELETE FROM player where  instance = ?', [process.env.NODE_APP_INSTANCE])
        await connection.close()
        this.presence.worldOffline(this.serverId)
    }
}
