import { Module }                   from "@nestjs/common";
import { PresenceClient }           from "./presence.client";
import { createMicroserviceClient } from "../../../lib/functions/create-microservice-client";

export const clientFactory   = () => createMicroserviceClient("presence", "Presence", "global");
export const CLIENT_PROVIDER = {
    provide   : "PRESENCE_CLIENT",
    useFactory: clientFactory
};

@Module({
    providers: [
        CLIENT_PROVIDER,
        PresenceClient
    ],
    exports  : [
        PresenceClient
    ]
})
export class PresenceClientModule {

}
