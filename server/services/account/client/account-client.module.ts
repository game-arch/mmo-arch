import { Module }             from "@nestjs/common";
import { AccountClient }      from "./account.client";
import { ClientProxyFactory } from "@nestjs/microservices";
import { environment }        from "../../../lib/config/environment";

export const clientFactory   = () => ClientProxyFactory.create(<any>{
    transport: environment.microservice.transport,
    options  : {
        ...environment.microservice.global,
        name: "Account Client"
    }
});
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
