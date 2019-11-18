import {Transport}                          from "@nestjs/common/enums/transport.enum";
import {ClientOptions, MicroserviceOptions} from "@nestjs/microservices";

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
    }
};
