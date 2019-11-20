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

    async online(socketId: string, host: string, port: string, name: string) {
        if (name && name !== '') {
            let server = await this.findByIpAndName(host, name);
            if (!server) {
                await this.repo.save(this.repo.create(new RegisteredWorld(host, port, socketId, name, 100, 0)));
                this.servers = await this.repo.find();
                return;
            }
            server.socketId = socketId;
            server.status   = 'online';
            server.port     = port;
            await this.repo.save(server);
            await this.userRepo.delete({world: server});
            this.servers = await this.repo.find();
        }
    }

    private findBySocketId(socketId: string) {
        return this.servers.filter(server => server.socketId === socketId)[0] || null;
    }

    private findByIpAndName(host: string, name: string) {
        return this.repo.findOne({where: {host: host, name}});
    }

    async set(socketId: string) {
        let server = this.findBySocketId(socketId);
        if (server) {
            server.current = server.users.length;
            await this.repo.save(server);
        }
    }

    async offline(socketId: string) {
        let server = await this.findBySocketId(socketId);
        if (server) {
            server.status  = 'offline';
            server.current = 0;
            await this.repo.save(server);
            await this.userRepo.delete({world: server});
            server.users = [];
        }
    }

    async clear() {
        await this.repo.clear();
    }

    async getServers() {
        return await from(this.servers)
            .pipe(map(server => {
                let clone = Object.assign({}, server);
                delete clone.users;
                return clone;
            }), toArray()).toPromise();
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
        this.servers = await this.repo.find();
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
            if (!registeredShard.users) {
                registeredShard.users = [];
            }
            let connected = new ConnectedUser(user.accountId, registeredShard);
            registeredShard.users.push(connected);
            await this.userRepo.save(connected, {reload: true});
            registeredShard.current = registeredShard.users.length;
            await this.repo.save(registeredShard);

        }
    }

    async removeUser(user: { accountId: number, world: string }) {
        let registeredShard = this.servers.filter(world => world.name === user.world)[0] || null;
        if (registeredShard) {
            if (!registeredShard.users) {
                registeredShard.users = [];
            }
            await this.userRepo.delete({world: registeredShard, accountId: user.accountId});
            registeredShard.users   = registeredShard.users.filter(conn => conn.accountId !== user.accountId);
            registeredShard.current = registeredShard.users.length;
            await this.repo.save(registeredShard);
        }
    }

}
