import { Module }                   from "@nestjs/common";
import { MapClient }                from "./map.client";
import { ClientProxyFactory }       from "@nestjs/microservices";
import { environment }              from "../../../lib/config/environment";
import { WorldConstants }           from "../../../lib/constants/world.constants";
import { createMicroserviceClient } from "../../../lib/functions/create-microservice-client";

export const clientFactory   = () => createMicroserviceClient(WorldConstants.CONSTANT + '.map', WorldConstants.NAME + " Map", "local");
export const CLIENT_PROVIDER = {
    provide   : "MAP_CLIENT",
    useFactory: clientFactory
};

@Module({
    imports  : [],
    providers: [
        CLIENT_PROVIDER,
        MapClient
    ],
    exports  : [
        MapClient
    ]
})
export class MapClientModule {

}
