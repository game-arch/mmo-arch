import {Module, OnApplicationBootstrap}                 from "@nestjs/common";
import {ClientProxy, ClientProxyFactory} from "@nestjs/microservices";
import {config}                                         from "./config";

export const clientFactory   = () => ClientProxyFactory.create({
    transport: config.microservice.transport,
    options: {
        ...config.microservice.options,
        name: 'Microservice Client'
    }
});
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
        await this.client.connect();
    }


}
