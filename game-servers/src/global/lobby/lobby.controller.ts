import {Controller, Get, Logger, Post, Req, Res} from '@nestjs/common';
import {LobbyService}                            from './lobby.service';
import {AccountClient}                           from "../account/client/account.client";
import {Request, Response}                       from "express";
import {EventPattern}                            from "@nestjs/microservices";
import {Events}                                  from "../../../lib/constants/events";
import {GameWorld}                               from "../../../lib/entities/game-world";
import {LobbyGateway}                            from "./lobby.gateway";

@Controller()
export class LobbyController {
    constructor(
        private  appService: LobbyService,
        private account: AccountClient,
        private gateway: LobbyGateway,
        private logger: Logger
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

    @EventPattern(Events.SERVER_LIST)
    serverList(servers: GameWorld[]) {
        this.gateway.servers = servers;
        this.gateway.server.emit(Events.SERVER_LIST, servers);
        this.logger.log('Server list updated.');
    }
}
