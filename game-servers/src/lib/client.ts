import {ClientOptions, ClientProxy, ClientProxyFactory} from "@nestjs/microservices";
import {config}                                         from "./config";

export const clientFactory = () => ClientProxyFactory.create(config.microservice as ClientOptions);

export const CLIENT_PROVIDER = {
    provide   : ClientProxy,
    useFactory: clientFactory
};
