import {Controller}  from '@nestjs/common';
import {
    EventPattern,
    MessagePattern
}                    from "@nestjs/microservices";
import {
    GlobalMessage,
    LocalMessage,
    PrivateMessage,
    RegionMessage,
    SystemMessage,
    TradeMessage,
    ZoneMessage
}                    from "./actions";
import {
    CharacterLoggedIn,
    CharacterOffline,
    CharacterOnline
} from "../../character/actions";
import {ChatGateway} from "./chat.gateway";

@Controller()
export class ChatController {


    constructor(
        private gateway: ChatGateway
    ) {

    }

    @EventPattern(CharacterLoggedIn.event)
    characterOnline(data: CharacterLoggedIn) {

    }

    @EventPattern(CharacterLoggedIn.event)
    characterOffline(data: CharacterLoggedIn) {

    }

    @EventPattern(SystemMessage.event)
    systemMessage(data: SystemMessage) {
        if (data.map) {
            this.gateway.server.to('map.' + data.map).emit(SystemMessage.event, data);
            return;
        }
        this.gateway.server.emit(SystemMessage.event, data);
    }

    @EventPattern(LocalMessage.event)
    localMessage(data: LocalMessage) {

    }

    @EventPattern(RegionMessage.event)
    regionMessage(data: RegionMessage) {

    }

    @EventPattern(ZoneMessage.event)
    zoneMessage(data: ZoneMessage) {
        this.gateway.server.to('map.' + data.map).emit(ZoneMessage.event, data);
    }

    @EventPattern(TradeMessage.event)
    tradeMessage(data: TradeMessage) {
        this.gateway.server.to('trade').emit(TradeMessage.event, data);
    }

    @EventPattern(GlobalMessage.event)
    globalMessage(data: GlobalMessage) {
        this.gateway.server.to('global').emit(GlobalMessage.event, data);
    }

    @EventPattern(PrivateMessage.event)
    privateMessage(data: PrivateMessage) {
    }

}
