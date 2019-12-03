import {Module}                   from "@nestjs/common";
import {MicroserviceClientModule} from "../../../lib/microservice-client/microservice-client.module";
import {MapClient}                from "./map.client";

@Module({
    imports: [
        MicroserviceClientModule
    ],
    providers: [
        MapClient
    ],
    exports: [
        MapClient
    ]
})
export class MapClientModule {

}
