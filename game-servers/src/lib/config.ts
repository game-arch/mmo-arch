import {Transport}                          from "@nestjs/common/enums/transport.enum";
import {ClientOptions, MicroserviceOptions} from "@nestjs/microservices";
import {PORTS}                              from "../../lib/constants/ports";

export const config = {
    microservice: <ClientOptions | MicroserviceOptions>{
        transport: Transport.REDIS,
        options  : {
            url: 'redis://' + (process.env.REDIS_HOST || 'localhost') + ':' + (process.env.REDIS_PORT || '6379')
        }
    },
    jwt         : {
        secret: 'legends-of-triumph'
    },
    mysql       : {
        host    : process.env.MYSQL_HOST || 'localhost',
        port    : parseInt(process.env.MYSQL_PORT || '3306'),
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || ''
    },
    redis       : {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
    },
    servers     : {
        lobby   : {
            host: process.env.LOBBY_HOST || 'localhost',
            port: process.env.LOBBY_PORT || PORTS.LOBBY
        },
        shard   : {
            host: process.env.SHARD_HOST || 'localhost',
            port: process.env.SHARD_PORT || PORTS.SHARD
        },
        register: {
            host: process.env.REGISTER_HOST || 'localhost',
            port: process.env.REGISTER_PORT || PORTS.REGISTER
        }
    }
};
