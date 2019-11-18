import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import {LobbyService}                    from './lobby.service';
import {AccountClient}                   from "../lib/microservice/account/account.client";
import {Request, Response}               from "express";

@Controller()
export class LobbyController {
    constructor(
        private  appService: LobbyService,
        private account: AccountClient
    ) {
    }

    @Post('register')
    async register(@Req() request: Request, @Res() response: Response) {
        try {
            await this.account.register(request.body.email, request.body.password);
        } catch (e) {
            response.status(e.status)
                    .send(e.message);
        }
    }

    @Post('login')
    async login(@Req() request: Request, @Res() response: Response) {
        try {
            await this.account.login(request.body.email, request.body.password);
        } catch (e) {
            response.status(e.status)
                    .send(e.message);
        }
    }

}
