import {Transport}   from "@nestjs/common/enums/transport.enum";
import {PORTS}       from "../../lib/constants/ports";
import {NatsOptions} from "@nestjs/microservices";

export const config = {
    microservice      : <NatsOptions>{
        transport: Transport.NATS,
        options  : {
            url : 'nats://' + (process.env.NATS_HOST || 'localhost') + ':' + (process.env.NATS_PORT || '4222'),
            user: process.env.NATS_USER || '',
            pass: process.env.NATS_PASSWORD || ''
        }
    },
    jwt               : {
        secret: process.env.JWT_SECRET || 'a-random-secret'
    },
    mysql             : {
        host    : process.env.MYSQL_HOST || 'localhost',
        port    : parseInt(process.env.MYSQL_PORT || '3306'),
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || ''
    },
    redis             : {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
    },
    servers           : {
        lobby   : {
            host: process.env.LOBBY_HOST || 'localhost',
            port: process.env.LOBBY_PORT || PORTS.LOBBY
        },
        world   : {
            host: process.env.WORLD_HOST || 'localhost',
            port: (parseInt(process.env.WORLD_PORT || ('' + PORTS.WORLD)) + parseInt(process.env.NODE_APP_INSTANCE)) + ''
        },
        presence: {
            host: process.env.PRESENCE_HOST || 'localhost',
            port: process.env.PRESENCE_PORT || PORTS.PRESENCE
        }
    }
};
