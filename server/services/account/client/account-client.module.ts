import { Module }                   from "@nestjs/common";
import { AccountClient }            from "./account.client";
import { createMicroserviceClient } from "../../../lib/functions/create-microservice-client";

export const clientFactory   = () => createMicroserviceClient("key", "Account", "global");
export const CLIENT_PROVIDER = {
    provide   : "ACCOUNT_CLIENT",
    useFactory: clientFactory
};

@Module({
    providers: [
        CLIENT_PROVIDER,
        AccountClient
    ],
    exports  : [
        AccountClient
    ]
})
export class AccountClientModule {

}
