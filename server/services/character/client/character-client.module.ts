import { Module }                   from "@nestjs/common";
import { CharacterClient }          from "./character.client";
import { WorldConstants }           from "../../../lib/constants/world.constants";
import { createMicroserviceClient } from "../../../lib/functions/create-microservice-client";

export const clientFactory   = () => createMicroserviceClient(WorldConstants.CONSTANT + '.character', WorldConstants.NAME + " Character", "local");
export const CLIENT_PROVIDER = {
    provide   : "CHARACTER_CLIENT",
    useFactory: clientFactory
};

@Module({
    imports  : [],
    providers: [
        CLIENT_PROVIDER,
        CharacterClient
    ],
    exports  : [
        CharacterClient
    ]
})
export class CharacterClientModule {

}
