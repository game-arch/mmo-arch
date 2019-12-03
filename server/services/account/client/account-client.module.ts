import {Module}             from "@nestjs/common";
import {AccountClient}      from "./account.client";
import {WorldClientModule}  from "../../../lib/world-client/world-client.module";
import {ClientProxyFactory} from "@nestjs/microservices";
import {environment}        from "../../../lib/config/environment";

export const clientFactory   = () => ClientProxyFactory.create({
    transport: environment.microservice.transport,
    options  : {
        ...environment.microservice.options,
        name : 'Account Client',
        queue: 'account'
    }
});
export const CLIENT_PROVIDER = {
    provide   : 'ACCOUNT_CLIENT',
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
