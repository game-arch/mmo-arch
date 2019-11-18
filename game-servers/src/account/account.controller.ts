import {Controller}     from '@nestjs/common';
import {AccountService} from './account.service';
import {MessagePattern} from "@nestjs/microservices";
import {Patterns}       from "../lib/microservice/patterns";
import {AccountClient}  from "../lib/microservice/account/account.client";

@Controller()
export class AccountController {
    constructor(
        private readonly service: AccountService,
        private client: AccountClient
    ) {
    }

    @MessagePattern(Patterns.REGISTER_ACCOUNT)
    async register(data: { email: string, password: string }) {
        return await this.service.register(data.email, data.password);
    }


    @MessagePattern(Patterns.LOGIN)
    async login(data: { email: string, password: string }) {
        console.log('Received Login');
        let response = await this.service.login(data.email, data.password);
        let user     = await this.service.getAccountByToken(response);
        this.client.updated(user.id, data.email);
        return response;
    }

    @MessagePattern(Patterns.VERIFY_ACCOUNT)
    async verify(data: string) {
        return await this.service.getAccountByToken(data);
    }
}
