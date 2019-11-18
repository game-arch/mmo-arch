import {Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {ClientProxy}                        from "@nestjs/microservices";
import {Patterns}                           from "../patterns";
import {first, tap}                         from "rxjs/operators";

@Injectable()
export class AccountClient implements OnApplicationBootstrap {

    constructor(private client: ClientProxy) {

    }

    async register(email: string, password: string) {
        return await this.client.send(Patterns.REGISTER_ACCOUNT, {email, password}).pipe(first()).toPromise();
    }

    async login(email: string, password: string) {
        return await this.client.send(Patterns.LOGIN, {email, password}).pipe(first()).toPromise();
    }

    async onApplicationBootstrap() {
        await this.client.connect();
    }
}
