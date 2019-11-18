import {Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {ClientProxy}                        from "@nestjs/microservices";
import {Patterns}                           from "../patterns";

@Injectable()
export class AccountClient implements OnApplicationBootstrap {

    constructor(private client: ClientProxy) {

    }

    async register(email: string, password: string) {
        await this.client.send(Patterns.REGISTER_ACCOUNT, {email, password});
    }

    async login(email: string, password: string) {
        await this.client.send(Patterns.LOGIN, {email, password});
    }

    async onApplicationBootstrap() {
        await this.client.connect();
    }
}
