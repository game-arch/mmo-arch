import { Controller }                                                from "@nestjs/common";
import { EventPattern }                                              from "@nestjs/microservices";
import { AllPlayers, PlayerEnteredMap, PlayerLeftMap, PlayerUpdate } from "../../map/actions";
import { MapGateway }                                                from "./map.gateway";
import { WORLD_PREFIX }                                              from "../world.prefix";

@Controller()
export class MapController {

    constructor(
        private gateway: MapGateway
    ) {

    }

    @EventPattern(WORLD_PREFIX + PlayerEnteredMap.event)
    async onMapJoined(data: PlayerEnteredMap) {
        await this.gateway.playerJoin(data);
    }

    @EventPattern(WORLD_PREFIX + PlayerLeftMap.event)
    async onMapLeft(data: PlayerLeftMap) {
        await this.gateway.playerLeave(data);
    }

    @EventPattern(WORLD_PREFIX + AllPlayers.event)
    onAllPlayers(data: AllPlayers) {
        let payload = { ...data };
        delete payload.map;
        this.gateway.allPlayers(payload);
    }

    @EventPattern(WORLD_PREFIX + PlayerUpdate.event)
    playerUpdate(data: PlayerUpdate) {
        let payload = { ...data };
        delete payload.map;
        this.gateway.server.to("map." + data.map).emit(PlayerUpdate.event, payload);
    }
}
