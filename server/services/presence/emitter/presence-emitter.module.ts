import {Module}                   from "@nestjs/common";
import {PresenceEmitter}          from "./presence.emitter";
import {MicroserviceClientModule} from "../../../lib/microservice-client/microservice-client.module";

@Module({
    imports  : [
        MicroserviceClientModule
    ],
    providers: [
        PresenceEmitter
    ],
    exports: [
        PresenceEmitter
    ]
})
export class PresenceEmitterModule {

}
