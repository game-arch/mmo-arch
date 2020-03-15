import { Transport } from '@nestjs/common/enums/transport.enum'
import { PORTS }     from '../constants/ports.constants'
import '../scripts/load-env'
import * as path     from 'path'

export const environment = {
    dbRoot      : path.resolve(__dirname, '../../../db'),
    microservice: {
        transport: Transport.NATS,
        global   : {
            url  : 'nats://' + (process.env.NATS_HOST || 'localhost') + ':' + (process.env.NATS_PORT || '4222'),
            user : process.env.NATS_USER || '',
            pass : process.env.NATS_PASSWORD || '',
            queue: 'global',
        },
        local    : {
            url  : 'nats://' + (process.env.LOCAL_NATS_HOST || 'localhost') + ':' + (process.env.LOCAL_NATS_PORT || '4223'),
            user: '',
            pass: '',
        },
    },
    redis       : {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
    },
    jwt         : {
        secret: process.env.JWT_SECRET || 'a-random-secret',
    },
    mysql       : {
        host    : process.env.MYSQL_HOST,
        port    : parseInt(process.env.MYSQL_PORT),
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
    },
    servers     : {
        world   : {
            host: process.env.WORLD_HOST || 'localhost',
            port: (parseInt(process.env.WORLD_PORT || ('' + PORTS.WORLD))) || 3005,
        },
        presence: {
            host: process.env.PRESENCE_HOST || 'localhost',
            port: process.env.PRESENCE_PORT || PORTS.PRESENCE,
        },
    },
}
