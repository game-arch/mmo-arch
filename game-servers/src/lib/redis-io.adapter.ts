import { IoAdapter }       from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import {Server}            from "socket.io";

const redisAdapter = redisIoAdapter({ host: 'localhost', port: 6379 });

export class RedisIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        options.transports = ['websocket', 'polling'];
        const server:Server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}
