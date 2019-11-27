import {Controller}                                  from "@nestjs/common";
import {EventPattern}                                from "@nestjs/microservices";
import {AllPlayers, PlayerEnteredMap, PlayerLeftMap} from "../map/actions";
import {WorldConstants}                              from "../constants";
import {MapGateway}                                  from "./map.gateway";

@Controller()
export class MapController {

    constructor(
        private gateway: MapGateway
    ) {

    }

    @EventPattern(PlayerEnteredMap.event)
    async onMapJoined(data: PlayerEnteredMap) {
        if (data.world === WorldConstants.CONSTANT) {
            this.gateway.playerJoin(data);
        }
    }

    @EventPattern(PlayerLeftMap.event)
    async onMapLeft(data: PlayerLeftMap) {
        if (data.world === WorldConstants.CONSTANT) {
            this.gateway.playerLeave(data);
        }
    }

    @EventPattern(AllPlayers.event)
    onAllPlayers(data: AllPlayers) {
        if (data.world === WorldConstants.CONSTANT) {
            this.gateway.allPlayers(data);
        }
    }
}
