import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                         from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { LobbyService }   from './lobby.service'
import { GameWorld }      from '../../../shared/interfaces/game-world'
import { Logger }         from '@nestjs/common'
import { AccountClient }  from '../account/client/account.client'

@WebSocketGateway()
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server
    socket: Socket
    servers: GameWorld[] = []

    accounts: { [socketId: string]: { id: number, email: string } } = {}

    constructor(
        private logger: Logger,
        private service: LobbyService,
        private account: AccountClient
    ) {

    }

    @SubscribeMessage('register')
    async register(client: Socket, data: { email: string, password: string }) {
        try {
            const token = await this.account.register(data.email, data.password)
            client.emit('register.success', token)
        } catch (e) {
            this.logger.log('Register Error', e)
        }
    }

    @SubscribeMessage('login')
    async login(client: Socket, data: { email: string, password: string }) {
        try {
            console.log('Received Login')
            const token              = await this.account.login(data.email, data.password)
            this.accounts[client.id] = await this.account.getAccount(token, true)
            this.logger.log(this.accounts[client.id].email + ' logged in.')
            this.logger.log(token)
            client.emit('login.success', token)
        } catch (e) {
            this.logger.log('Login Error', e)
        }
    }


    async handleDisconnect(client: Socket) {
        try {
            if (this.accounts.hasOwnProperty(client.id)) {
                this.logger.log(this.accounts[client.id].email + ' disconnected.')
                delete this.accounts[client.id]
            }
        } catch (e) {
            console.error(e)
        }
    }

    async afterInit(server: Server) {
        this.service.getServers()
    }

    handleConnection(client: any, ...args: any[]): any {
        this.logger.log(client.id, 'connected!')
    }
}
