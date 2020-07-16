import { Controller }   from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import {
    GlobalMessage,
    LocalMessage,
    PrivateMessage,
    RegionMessage,
    SystemMessage,
    TradeMessage,
    ZoneMessage
}                       from './actions'
import { ChatGateway } from './chat.gateway'
import { WorldEvent }  from '../../../lib/event.types'

@Controller()
export class ChatController {


    constructor(
        private gateway: ChatGateway
    ) {

    }

    @EventPattern(new WorldEvent(SystemMessage.event))
    systemMessage(data: SystemMessage) {
        if (data.map) {
            this.gateway.server.to('map.' + data.map + '.' + data.channel).emit(SystemMessage.event, data)
            return
        }
        this.gateway.server.emit(SystemMessage.event, data)
    }

    @EventPattern(new WorldEvent(LocalMessage.event))
    localMessage(data: LocalMessage) {

    }

    @EventPattern(new WorldEvent(RegionMessage.event))
    regionMessage(data: RegionMessage) {

    }

    @EventPattern(new WorldEvent(ZoneMessage.event))
    zoneMessage(data: ZoneMessage) {
        this.gateway.server.to('map.' + data.map + '.' + data.channel).emit(ZoneMessage.event, data)
    }

    @EventPattern(new WorldEvent(TradeMessage.event))
    tradeMessage(data: TradeMessage) {
        this.gateway.server.to('trade').emit(TradeMessage.event, data)
    }

    @EventPattern(new WorldEvent(GlobalMessage.event))
    globalMessage(data: GlobalMessage) {
        this.gateway.server.to('global').emit(GlobalMessage.event, data)
    }

    @EventPattern(new WorldEvent(PrivateMessage.event))
    privateMessage(data: PrivateMessage) {
    }

}
