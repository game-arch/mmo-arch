import {Injectable}       from '@nestjs/common';
import {RegisteredServer} from "./registered-server";

@Injectable()
export class RegisterService {

    private servers:{[socketId:string]: RegisteredServer} = {};

    getHello(): string {
        return 'Hello World!';
    }

    register(socketId: string, ip: string) {
        this.servers[socketId] = new RegisteredServer(ip, 10, 0);
    }

    set(socketId: string, capacity: number, current: number) {
        let server      = this.servers[socketId];
        server.capacity = capacity;
        server.current  = current;
    }
    has(socketId:string) {
        return this.servers.hasOwnProperty(socketId);
    }

    unregister(socketId: string) {
        delete this.servers[socketId];
    }

    getAll() {
        return [...Object.keys(this.servers).map(key => this.servers[key])];
    }
}
