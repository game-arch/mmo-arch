import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {RegisteredServer}                   from "./entities/registered-server";
import {Repository}                         from "typeorm";
import {InjectRepository}                   from "@nestjs/typeorm";

@Injectable()
export class RegisterService implements OnApplicationBootstrap {

    private servers: RegisteredServer[] = [];

    constructor(@InjectRepository(RegisteredServer) private repo: Repository<RegisteredServer>) {
    }

    getHello(): string {
        return 'Hello World!';
    }

    async online(socketId: string, ip: string, name: string) {
        if (name && name !== '') {
            let server = await this.findByIpAndName(ip, name);
            if (!server) {
                await this.repo.save(this.repo.create(new RegisteredServer(ip, socketId, name, 10, 0)));
                this.servers = await this.repo.find();
                return;
            }
            server.socketId = socketId;
            server.status   = 'online';
            await this.repo.save(server);
            this.servers = await this.repo.find();
        }
    }

    private findBySocketId(socketId: string) {
        return this.repo.findOne({where: {socketId}});
    }

    private findByIpAndName(ip: string, name: string) {
        return this.repo.findOne({where: {ip, name}});
    }

    async set(socketId: string, capacity: number, current: number) {
        let server = await this.findBySocketId(socketId);
        if (server) {
            server.capacity = capacity;
            server.current  = current;
            await this.repo.save(server);
            this.servers = await this.repo.find();
        }
    }

    async offline(socketId: string) {
        let server = await this.findBySocketId(socketId);
        if (server) {
            server.status = 'offline';
            await this.repo.save(server);
            this.servers = await this.repo.find();
        }
    }

    async clear() {
        await this.repo.clear();
    }

    getAll() {
        return this.servers;
    }

    async onApplicationBootstrap() {
        await this.repo.createQueryBuilder('server')
                  .delete()
                  .where('name = ""')
                  .execute();
        await this.repo.createQueryBuilder('server')
                  .update(RegisteredServer, {status: 'offline'})
                  .where('status = :status', {status: 'online'})
                  .execute();
        this.servers = await this.repo.find();
    }

}
