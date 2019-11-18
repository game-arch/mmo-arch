import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import {AccountService}                  from './account.service';
import {MessagePattern}                  from "@nestjs/microservices";
import {Patterns}                        from "../lib/microservice/patterns";

@Controller()
export class AccountController {
    constructor(private readonly service: AccountService) {
    }

    @MessagePattern(Patterns.REGISTER_ACCOUNT)
    async register(data: { email: string, password: string }) {
        await this.service.register(data.email, data.password);
        return 'Success!';
    }


    @MessagePattern(Patterns.LOGIN)
    async login(data: { email: string, password: string }) {
        await this.service.login(data.email, data.password);
        return 'Success!';
    }
}
