import {Controller}                                                          from "@nestjs/common";
import {EventPattern}                                                        from "@nestjs/microservices";
import {AllPlayers, PlayerDirectionalInput, PlayerEnteredMap, PlayerLeftMap} from "../../map/actions";
import {MapGateway}                                                          from "./map.gateway";
import {LocalMessage}                                                        from "../chat/actions";
import {WORLD_PREFIX}                                                        from "../world.prefix";

@Controller()
export class MapController {

    constructor(
        private gateway: MapGateway
    ) {

    }

    @EventPattern(WORLD_PREFIX + PlayerEnteredMap.event)
    async onMapJoined(data: PlayerEnteredMap) {
        this.gateway.playerJoin(data);
    }

    @EventPattern(WORLD_PREFIX + PlayerLeftMap.event)
    async onMapLeft(data: PlayerLeftMap) {
        this.gateway.playerLeave(data);
    }

    @EventPattern(WORLD_PREFIX + AllPlayers.event)
    onAllPlayers(data: AllPlayers) {
        this.gateway.allPlayers(data);
    }

    @EventPattern(WORLD_PREFIX + PlayerDirectionalInput.event)
    async playerMoved(data: PlayerDirectionalInput) {
        this.gateway.server.to('map.' + data.map).emit(PlayerDirectionalInput.event, data);
    }
}
