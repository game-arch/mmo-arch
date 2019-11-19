import {Injectable}  from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {Patterns}    from "../patterns";
import {first, tap}  from "rxjs/operators";

@Injectable()
export class AccountClient {

    constructor(private client: ClientProxy) {

    }

    async register(email: string, password: string): Promise<string> {
        return await this.client.send(Patterns.REGISTER_ACCOUNT, {email, password}).pipe(first()).toPromise();
    }

    async login(email: string, password: string): Promise<string> {
        return await this.client.send(Patterns.LOGIN, {email, password}).pipe(first()).toPromise();
    }

    updated(id: number, email: string) {
        this.client.emit(Patterns.ACCOUNT_UPDATED, {id, email});
    }

    async getAccountByToken(token: string) {
        return await this.client.send(Patterns.VERIFY_ACCOUNT, token).pipe(first()).toPromise();
    }
}
