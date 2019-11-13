import {Injectable}       from '@nestjs/common';
import {RegisteredServer} from "./entities/registered-server.entity";
import {Repository}       from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class RegisterService {

    constructor(@InjectRepository(RegisteredServer) private repo: Repository<RegisteredServer>) {

    }

    getHello(): string {
        return 'Hello World!';
    }

    async register(socketId: string, ip: string) {
        await this.repo.save(this.repo.create(new RegisteredServer(ip, socketId, 10, 0)));
    }

    async set(socketId: string, capacity: number, current: number) {
        let condition = {where: {socketId}};
        let server    = (await this.repo.find(condition))[0];
        if (server) {
            server.capacity = capacity;
            server.current  = current;
            await this.repo.update(server.id, server);
        }
    }

    async unregister(socketId: string) {
        let condition = {where: {socketId}};
        let server    = (await this.repo.find(condition))[0];
        if (server) {
            await this.repo.delete(server.id);
        }
    }
    async clear() {
        await this.repo.clear();
    }

    async getAll() {
        return await this.repo.find();
    }
}
