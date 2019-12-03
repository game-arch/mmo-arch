import {Module}            from "@nestjs/common";
import {WorldClientModule} from "../../../lib/world-client/world-client.module";
import {MapClient}         from "./map.client";

@Module({
    imports: [
        WorldClientModule
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
