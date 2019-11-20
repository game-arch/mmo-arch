import {Module}                   from "@nestjs/common";
import {AccountClient}            from "./account.client";
import {MicroserviceClientModule} from "../../microservice-client.module";

@Module({
    imports  : [
        MicroserviceClientModule
    ],
    providers: [
        AccountClient
    ],
    exports  : [
        AccountClient
    ]
})
export class AccountClientModule {

}
