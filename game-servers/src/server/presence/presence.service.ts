import {Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {RegisteredWorld}                            from "./entities/registered-world";
import {Repository}                                 from "typeorm";
import {InjectRepository}                           from "@nestjs/typeorm";
import {ConnectedUser}                              from "./entities/connected-user";
import {from, Subject}                              from "rxjs";
import {map, toArray}                               from "rxjs/operators";
import {WebSocketServer}                            from "@nestjs/websockets";
import {Server}                                     from "socket.io";

@Injectable()
export class PresenceService implements OnApplicationBootstrap {
    private servers: RegisteredWorld[] = [];
    sendServers                        = new Subject();

    constructor(
        @InjectRepository(RegisteredWorld)
        private repo: Repository<RegisteredWorld>,
        @InjectRepository(ConnectedUser)
        private userRepo: Repository<ConnectedUser>,
        private logger: Logger
    ) {
    }

    async online(socketId: string, host: string, port: number, instanceId: number, name: string) {
        try {
            if (name && name !== '' && host !== '' && Boolean(socketId)) {
                let server = await this.repo.findOne({where: {host, name, port, instanceId: instanceId + 1}});
                if (!server) {
                    let count   = await this.repo.query('select distinct host, port, name from presence.registered_world where name = ? and NOT (host = ? AND port = ?)', [name, host, port]);
                    let world   = this.repo.create(new RegisteredWorld(host, port, instanceId + 1, socketId, name, 100, 0));
                    world.index = count.length + 1;
                    await this.repo.save(world);
                    await this.loadServers();
                    return;
                }
                await this.userRepo.delete({serverSocketId: socketId});
                server.socketId = socketId;
                server.status   = 'online';
                server.port     = port;
                await this.repo.save(server);
                await this.loadServers();
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async loadServers() {
        this.servers = await this.repo.createQueryBuilder('world')
                                 .select('world.name, world.index, MAX(world.host) host, MAX(world.port) port, SUM(world.current) current, SUM(IF (world.status = "online", world.capacity, 0)) capacity, MAX(world.status) status')
                                 .groupBy('world.name, world.index')
                                 .orderBy('7', 'DESC')
                                 .getRawMany();
        this.sendServers.next(this.servers);
    }

    async findBySocketId(socketId: string) {
        return await this.repo.findOne({socketId});
    }

    async set(socketId: string) {
        let server = await this.findBySocketId(socketId);
        if (server) {
            await this.repo.save(server);
        }
    }

    async offline(socketId: string) {
        try {
            if (Boolean(socketId)) {
                let server = await this.findBySocketId(socketId);
                if (server) {
                    server.status  = 'offline';
                    server.current = 0;
                    await this.repo.save(server);
                    await this.userRepo.delete({serverSocketId: socketId});
                    await this.loadServers();
                }
            }
        } catch (e) {
            console.error(e);
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

    async addUser(socketId: string, user: { accountId: number, world: string }) {
        try {
            let registeredWorld = await this.findBySocketId(socketId);
            if (registeredWorld) {
                let connected = new ConnectedUser(user.accountId, registeredWorld.name, socketId);
                let found     = await this.userRepo.findOne({accountId: user.accountId});
                if (found) {
                    connected                = found;
                    connected.world          = registeredWorld.name;
                    connected.serverSocketId = socketId;
                    connected.characterName  = '';
                }
                await this.userRepo.save(connected);
                let count               = await this.getConnectedUserCount(socketId);
                registeredWorld.current = count[0].count;
                registeredWorld.full    = registeredWorld.current >= registeredWorld.capacity;
                await this.repo.save(registeredWorld);
                await this.loadServers();
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async getConnectedUserCount(socketId: string) {
        return await this.userRepo.query('select count(1) count from presence.connected_user where serverSocketId = ?', [socketId]);
    }

    async removeUser(socketId: string, user: { accountId: number, world: string }) {
        try {
            let registeredWorld = await this.findBySocketId(socketId);
            if (registeredWorld) {
                await this.characterLeave(user);
                await this.userRepo.delete({accountId: user.accountId});
                let count               = await this.getConnectedUserCount(socketId);
                registeredWorld.current = count[0].count;
                registeredWorld.full    = registeredWorld.current >= registeredWorld.capacity;
                await this.repo.save(registeredWorld);
                await this.loadServers();
            }
        } catch (e) {
            console.error(e);
        }
    }

    async characterJoin(character: { accountId: number, name: string }) {
        try {
            let user = await this.userRepo.findOne({where: {accountId: character.accountId}});
            if (user) {
                user.characterName = character.name;
                await this.userRepo.save(user);
                this.logger.log("The player '" + character.name + "' has signed in.");
            }
        } catch (e) {
            console.error(e);
        }
    }

    async characterLeave(character: { accountId: number }) {
        try {
            let user = await this.userRepo.findOne({where: {accountId: character.accountId}});
            if (user) {
                let name           = '' + user.characterName;
                user.characterName = '';
                await this.userRepo.save(user);
                this.logger.log("The player '" + name + "' has signed out.");
            }
        } catch (e) {
            console.error(e);
        }
    }

}
