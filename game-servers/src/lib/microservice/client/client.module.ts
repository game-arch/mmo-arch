import {Module}          from "@nestjs/common";
import {CLIENT_PROVIDER} from "../../client";
import {ClientProxy}     from "@nestjs/microservices";

@Module({
    providers: [
        CLIENT_PROVIDER
    ],
    exports: [
        ClientProxy
    ]
})
export class ClientModule {

}
