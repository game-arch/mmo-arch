import { Controller }     from "@nestjs/common";
import { EventPattern }   from "@nestjs/microservices";
import {
    GlobalMessage,
    LocalMessage,
    PrivateMessage,
    RegionMessage,
    SystemMessage,
    TradeMessage,
    ZoneMessage
}                         from "./actions";
import { ChatGateway }    from "./chat.gateway";
import { WorldConstants } from "../../../../lib/constants/world.constants";

@Controller()
export class ChatController {


    constructor(
        private gateway: ChatGateway
    ) {

    }

    @EventPattern(WorldConstants.CONSTANT + "." + SystemMessage.event)
    systemMessage(data: SystemMessage) {
        if (data.map) {
            this.gateway.server.to("map." + data.map).emit(SystemMessage.event, data);
            return;
        }
        this.gateway.server.emit(SystemMessage.event, data);
    }

    @EventPattern(WorldConstants.CONSTANT + "." + LocalMessage.event)
    localMessage(data: LocalMessage) {

    }

    @EventPattern(WorldConstants.CONSTANT + "." + RegionMessage.event)
    regionMessage(data: RegionMessage) {

    }

    @EventPattern(WorldConstants.CONSTANT + "." + ZoneMessage.event)
    zoneMessage(data: ZoneMessage) {
        this.gateway.server.to("map." + data.map).emit(ZoneMessage.event, data);
    }

    @EventPattern(WorldConstants.CONSTANT + "." + TradeMessage.event)
    tradeMessage(data: TradeMessage) {
        this.gateway.server.to("trade").emit(TradeMessage.event, data);
    }

    @EventPattern(WorldConstants.CONSTANT + "." + GlobalMessage.event)
    globalMessage(data: GlobalMessage) {
        this.gateway.server.to("global").emit(GlobalMessage.event, data);
    }

    @EventPattern(WorldConstants.CONSTANT + "." + PrivateMessage.event)
    privateMessage(data: PrivateMessage) {
    }

}
