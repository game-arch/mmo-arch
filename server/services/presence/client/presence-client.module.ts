import { Module }         from "@nestjs/common";
import { PresenceClient } from "./presence.client";
import { ClientModule }   from "../../../lib/client/client.module";

@Module({
    imports  : [ClientModule],
    providers: [
        PresenceClient
    ],
    exports  : [
        PresenceClient
    ]
})
export class PresenceClientModule {

}
