import {Module}         from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy}    from "./jwt.strategy";
import {JwtModule}      from "@nestjs/jwt";
import {config}         from "../config";

@Module({
    imports  : [
        PassportModule,
        JwtModule.register({
            secret     : config.jwt.secret,
            signOptions: {expiresIn: '60s'},
        }),
    ],
    providers: [
        JwtStrategy
    ]
})
export class AuthStrategyModule {

}
