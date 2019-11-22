import {Module}                   from "@nestjs/common";
import {PresenceClient}           from "./presence.client";
import {MicroserviceClientModule} from "../../microservice-client.module";

@Module({
    imports  : [
        MicroserviceClientModule
    ],
    providers: [
        PresenceClient
    ],
    exports  : [
        PresenceClient
    ]
})
export class PresenceClientModule {

}
