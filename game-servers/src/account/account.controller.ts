import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import {AccountService}                  from './account-service';
import {Request, Response}               from "express";

@Controller()
export class AccountController {
    constructor(private readonly service: AccountService) {
    }

    @Post('register')
    async register(@Req() request: Request, @Res() response: Response) {
        try {
            await this.service.register(request.body.email, request.body.password);
            response.send("Success!");
        } catch (e) {
            response.status(e.status)
                    .send(e.message);
        }
    }


    @Post('login')
    async login(@Req() request: Request, @Res() response: Response) {
        try {
            await this.service.login(request.body.email, request.body.password);
            response.send("Success!");
        } catch (e) {
            response.status(e.status)
                    .send(e.message);
        }
    }
}
