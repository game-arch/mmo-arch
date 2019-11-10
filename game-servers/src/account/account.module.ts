import {Module}            from '@nestjs/common';
import {AccountController} from './account.controller';
import {AccountService}    from './account.service';
import {AccountGateway}    from "./account.gateway";

@Module({
    imports    : [],
    controllers: [AccountController],
    providers  : [AccountService, AccountGateway],
    exports    : [AccountGateway]
})
export class AccountModule {
}
