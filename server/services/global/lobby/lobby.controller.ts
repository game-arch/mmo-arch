import {Controller, Logger, Post, Req, Res} from '@nestjs/common'
import {LobbyService}                       from './lobby.service'
import {AccountClient}                      from '../account/client/account.client'
import {Request, Response}                  from 'express'
import {EventPattern}                       from '@nestjs/microservices'
import {GameWorld}                          from '../../../lib/interfaces/game-world'
import {LobbyGateway}                       from './lobby.gateway'
import {GetServers}                         from '../presence/actions'

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
            let token = await this.account.register(request.body.email, request.body.password)
            response.send({token})
        } catch (e) {
            this.handleError(e, response)
        }
    }

    @Post('login')
    async login(@Req() request: Request, @Res() response: Response) {
        try {
            let token = await this.account.login(request.body.email, request.body.password)
            response.status(200)
            response.send({token})
        } catch (e) {
            this.handleError(e, response)
        }
    }

    @EventPattern(GetServers.event + '.response')
    serverList(servers: GameWorld[]) {
        try {
            this.gateway.servers = servers
            this.gateway.server.emit(GetServers.event, servers)
            this.logger.log('Server list updated.')
        } catch (e) {
            console.error(e)
        }
    }

    private handleError(e, response: Response) {
        if (e.status) {
            response.status(e.status).send(e.message)
            return
        }
        response.status(500).send(e.message || 'Internal Server Error')
    }
}
