import {Module}             from '@nestjs/common';
import {RegisterController} from './register.controller';
import {RegisterService}    from './register.service';
import {RegisterGateway}    from "./register.gateway";
import {DATABASE_MODULE}    from "../lib/database/database.module";

@Module({
    imports    : [DATABASE_MODULE('register', __dirname)],
    providers  : [RegisterGateway, RegisterService],
    controllers: [RegisterController],
    exports    : [RegisterGateway]
})
export class RegisterModule {
}
