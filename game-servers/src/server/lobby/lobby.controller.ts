import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import {LobbyService}                    from './lobby.service';
import {AccountClient}                   from "../../lib/microservice-clients/account/account.client";
import {Request, Response}               from "express";
import {EventPattern, MessagePattern}    from "@nestjs/microservices";
import {Patterns}                        from "../../lib/microservice-clients/patterns";

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
            let token = await this.account.register(request.body.email, request.body.password);
            response.send({token});
        } catch (e) {
            this.handleError(e, response);
        }
    }

    @Post('login')
    async login(@Req() request: Request, @Res() response: Response) {
        try {
            let token = await this.account.login(request.body.email, request.body.password);
            response.status(200);
            response.send({token});
        } catch (e) {
            this.handleError(e, response);
        }
    }

    private handleError(e, response: Response) {
        if (e.status) {
            response.status(e.status).send(e.message);
            return;
        }
        response.status(500).send(e.message || 'Internal Server Error');
    }

    @EventPattern(Patterns.ACCOUNT_UPDATED)
    onAccountChange(data: any) {
        console.log('Account Updated', data);
    }
}
