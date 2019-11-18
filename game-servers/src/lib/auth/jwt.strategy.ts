import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy }     from '@nestjs/passport';
import { Injectable }           from '@nestjs/common';
import {config}                 from "../config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.jwt.secret,
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
