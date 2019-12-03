import { IoAdapter }       from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import {environment}       from "../../lib/config/environment";

const redisAdapter = redisIoAdapter(environment.redis);

export class RedisIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}
