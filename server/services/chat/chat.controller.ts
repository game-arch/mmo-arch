import {Controller, Get} from '@nestjs/common';
import {ChatService} from './chat.service';
import {
    EventPattern,
    MessagePattern
} from "@nestjs/microservices";
import {
    CharacterOffline,
    CharacterOnline
} from "../character/actions";
import {GlobalMessage, LocalMessage, PrivateMessage, RegionMessage, TradeMessage, ZoneMessage} from "./actions";

@Controller()
export class ChatController {
    constructor(private readonly service: ChatService) {
    }

    @MessagePattern(CharacterOnline.event)
    characterOnline(data: CharacterOnline) {

    }

    @MessagePattern(CharacterOffline.event)
    characterOffline(data: CharacterOffline) {

    }

    @MessagePattern(LocalMessage.event)
    localMessage(data: LocalMessage) {

    }

    @MessagePattern(RegionMessage.event)
    regionMessage(data: RegionMessage) {

    }

    @MessagePattern(ZoneMessage.event)
    zoneMessage(data: ZoneMessage) {

    }

    @MessagePattern(TradeMessage.event)
    tradeMessage(data: TradeMessage) {

    }

    @MessagePattern(GlobalMessage.event)
    globalMessage(data: GlobalMessage) {

    }

    @MessagePattern(PrivateMessage.event)
    privateMessage(data: PrivateMessage) {

    }

}
