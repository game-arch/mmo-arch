import { Module }             from "@nestjs/common";
import { ClientProxyFactory } from "@nestjs/microservices";
import { environment }        from "../config/environment";

export const localClientFactory  = () => ClientProxyFactory.create(<any>{
    transport: environment.microservice.transport,
    options  : {
        ...environment.microservice.local
    }
});
export const LOCAL_PROVIDER      = {
    provide   : "LOCAL_CLIENT",
    useFactory: localClientFactory
};
export const globalClientFactory = () => ClientProxyFactory.create(<any>{
    transport: environment.microservice.transport,
    options  : {
        ...environment.microservice.global
    }
});
;
export const GLOBAL_PROVIDER = {
    provide   : "GLOBAL_CLIENT",
    useFactory: globalClientFactory
};

@Module({
    providers: [
        LOCAL_PROVIDER,
        GLOBAL_PROVIDER
    ],
    exports  : [
        LOCAL_PROVIDER,
        GLOBAL_PROVIDER
    ]
})
export class ClientModule {

}
