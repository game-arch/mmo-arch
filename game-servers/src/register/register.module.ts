import {Module}             from '@nestjs/common';
import {RegisterController} from './register.controller';
import {RegisterService}    from './register.service';
import {RegisterGateway}    from "./register.gateway";

@Module({
    imports    : [],
    providers  : [RegisterGateway, RegisterService],
    controllers: [RegisterController],
    exports    : [RegisterGateway]
})
export class RegisterModule {
}
