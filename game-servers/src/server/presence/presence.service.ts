import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {RegisteredWorld}                    from "./entities/registered-world";
import {Repository}                         from "typeorm";
import {InjectRepository}                   from "@nestjs/typeorm";
import {ConnectedUser}                      from "./entities/connected-user";
import {from}                               from "rxjs";
import {map, toArray}                       from "rxjs/operators";

@Injectable()
export class PresenceService implements OnApplicationBootstrap {

    private servers: RegisteredWorld[] = [];

    constructor(
        @InjectRepository(RegisteredWorld)
        private repo: Repository<RegisteredWorld>,
        @InjectRepository(ConnectedUser)
        private userRepo: Repository<ConnectedUser>
    ) {
    }

    async online(socketId: string, host: string, port: number, instanceId: number, name: string) {
        if (name && name !== '') {
            let server = await this.repo.findOne({where: {host, name, port, instanceId: instanceId + 1}});
            if (!server) {
                let count   = await this.repo.query('select count(*) count from presence.registered_world where host = ? and name = ? and port = ?', [host, name, port]);
                let world   = this.repo.create(new RegisteredWorld(host, port, instanceId + 1, socketId, name, 100, 0));
                world.index = parseInt(count[0].count) + 1;
                await this.repo.save(world);
                await this.loadServers();
                return;
            }
            server.socketId = socketId;
            server.status   = 'online';
            server.port     = port;
            await this.repo.save(server);
            await this.userRepo.delete({world: server.name});
            await this.loadServers();
        }
    }

    private async loadServers() {
        this.servers = await this.repo.find({where: {index: 1}, order: {full: 1, name: 1, index: 1}});
    }

    private findBySocketId(socketId: string) {
        return this.servers.filter(server => server.socketId === socketId)[0] || null;
    }

    async set(socketId: string) {
        let server = this.findBySocketId(socketId);
        if (server) {
            await this.repo.save(server);
        }
    }

    async offline(socketId: string) {
        let server = await this.findBySocketId(socketId);
        if (server) {
            server.status  = 'offline';
            server.current = 0;
            await this.repo.save(server);
            await this.userRepo.delete({world: server.name});
        }
    }

    async clear() {
        await this.repo.clear();
    }

    getServers() {
        return this.servers;
    }

    async onApplicationBootstrap() {
        await this.repo.createQueryBuilder('server')
                  .delete()
                  .where('name = ""')
                  .execute();
        await this.repo.createQueryBuilder('server')
                  .update(RegisteredWorld, {status: 'offline'})
                  .where('status = :status', {status: 'online'})
                  .execute();
        await this.loadServers();
    }

    getHost(host: string) {
        if (host.indexOf('127.0.0.1') !== -1) {
            return 'localhost';
        }
        return host;
    }

    async addUser(user: { accountId: number, world: string }) {
        let registeredShard = this.servers.filter(world => world.name === user.world)[0] || null;
        if (registeredShard) {
            let connected = new ConnectedUser(user.accountId, registeredShard.name);
            await this.userRepo.save(connected, {reload: true});
            let count               = await this.getConnectedUserCount(registeredShard.name);
            registeredShard.current = count[0].count;
            registeredShard.full    = registeredShard.current >= registeredShard.capacity;
            await this.repo.save(registeredShard);

        }
    }

    private async getConnectedUserCount(name: string) {
        return await this.userRepo.query('select count(1) count from presence.connected_user where world = ?', [name]);
    }

    async removeUser(user: { accountId: number, world: string }) {
        let registeredShard = this.servers.filter(world => world.name === user.world)[0] || null;
        if (registeredShard) {
            await this.userRepo.delete({world: registeredShard.name, accountId: user.accountId});
            let count               = await this.getConnectedUserCount(registeredShard.name);
            registeredShard.current = count[0].count;
            registeredShard.full    = registeredShard.current >= registeredShard.capacity;
            await this.repo.save(registeredShard);
        }
    }

}
