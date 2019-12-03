import {Module}            from "@nestjs/common";
import {CharacterClient}   from "./character.client";
import {WorldClientModule} from "../../../lib/world-client/world-client.module";

@Module({
    imports  : [
        WorldClientModule
    ],
    providers: [
        CharacterClient
    ],
    exports  : [
        CharacterClient
    ]
})
export class CharacterClientModule {

}
