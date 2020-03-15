import { Controller }     from '@nestjs/common'
import { AccountService } from './account.service'
import { MessagePattern } from '@nestjs/microservices'
import { AccountEvents }  from './account.events'
import { AccountClient }  from './client/account.client'

@Controller()
export class AccountController {
    constructor(
        private readonly service: AccountService,
        private client: AccountClient
    ) {
    }

    @MessagePattern(AccountEvents.REGISTER)
    async register(data: { email: string, password: string }) {
        return await this.service.register(data.email, data.password)
    }


    @MessagePattern(AccountEvents.LOGIN)
    async login(data: { email: string, password: string }) {
        const response = await this.service.login(data.email, data.password)
        const user     = await this.service.getAccountByToken(response)
        this.client.updated(user.id, data.email)
        return response
    }

    @MessagePattern(AccountEvents.VERIFY)
    async verify(data: string) {
        return await this.service.getAccountByToken(data)
    }

    @MessagePattern(AccountEvents.GET)
    async get({ token, ignoreExpiration }) {
        return await this.service.getAccountByToken(token, ignoreExpiration)
    }
}
