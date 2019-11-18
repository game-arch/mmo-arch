import {Module, OnApplicationBootstrap} from "@nestjs/common";
import {CLIENT_PROVIDER}                from "../../client";
import {ClientProxy}                    from "@nestjs/microservices";

@Module({
    providers: [
        CLIENT_PROVIDER
    ],
    exports  : [
        ClientProxy
    ]
})
export class ClientModule implements OnApplicationBootstrap {
    constructor(private client: ClientProxy) {

    }

    async onApplicationBootstrap() {
        console.log('connect to microservices!');
        await this.client.connect();
    }


}
