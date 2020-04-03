import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { WorldConstants }                                      from '../../../lib/constants/world.constants'
import { Namespace, Socket }                                   from 'socket.io'
import { InjectRepository }                                    from '@nestjs/typeorm'
import { Player }                                              from '../entities/player'
import { Repository }                                          from 'typeorm'
import { Logger }                                              from '@nestjs/common'
import { WorldService }                                        from '../world.service'
import { ActionClient }                                        from '../../action/client/action.client'
import { AttemptAction }                                       from '../../../../shared/events/action.events'

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT,
    parser
})
export class ActionGateway {

    @WebSocketServer()
    server: Namespace

    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        private logger: Logger,
        private service: WorldService,
        private action: ActionClient
    ) {

    }

    @SubscribeMessage(AttemptAction.event)
    async onAction(client: Socket, data: AttemptAction) {
        let player = await this.players.findOne({ socketId: client.id })
        if (player && player.characterId) {
            data.characterId = player.characterId
            return await this.action.attempt(data)
        }
        return false
    }
}
