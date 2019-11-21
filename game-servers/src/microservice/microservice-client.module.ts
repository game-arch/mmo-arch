import {Module, OnApplicationBootstrap}                 from "@nestjs/common";
import {ClientOptions, ClientProxy, ClientProxyFactory} from "@nestjs/microservices";
import {config}                                         from "../lib/config";

export const clientFactory   = () => ClientProxyFactory.create(config.microservice as ClientOptions);
export const CLIENT_PROVIDER = {
    provide   : ClientProxy,
    useFactory: clientFactory
};

@Module({
    providers: [
        CLIENT_PROVIDER
    ],
    exports  : [
        ClientProxy
    ]
})
export class MicroserviceClientModule implements OnApplicationBootstrap {
    constructor(private client: ClientProxy) {

    }

    async onApplicationBootstrap() {
        console.log('connect to microservices!');
        await this.client.connect();
    }


}
