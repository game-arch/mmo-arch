import {HttpService, Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {RegisteredWorld}                                         from "./entities/registered-world";
import {Repository}                                              from "typeorm";
import {InjectRepository}                                        from "@nestjs/typeorm";
import {ConnectedUser}                                           from "./entities/connected-user";
import {from, of, Subject}                                       from "rxjs";
import {catchError, map, mergeMap, tap, toArray}                 from "rxjs/operators";
import {WebSocketServer}                                         from "@nestjs/websockets";
import {Server}                                                  from "socket.io";
import {PresenceClient}                                          from "./client/presence.client";

@Injectable()
export class PresenceService implements OnApplicationBootstrap {

    constructor(
        private http: HttpService,
        @InjectRepository(RegisteredWorld)
        private repo: Repository<RegisteredWorld>,
        @InjectRepository(ConnectedUser)
        private userRepo: Repository<ConnectedUser>,
        private logger: Logger,
        private client: PresenceClient
    ) {
    }

    async healthCheck() {
        this.client.sendServers(await this.getServers());
        let servers = await this.repo.find({status: 'online'});

        await from(servers || [])
            .pipe(mergeMap(server => {
                return this.http.get('http://' + server.host + ':' + server.port + '/health').pipe(
                    catchError(err => {
                        if (server.status === 'online') {
                            this.toggleServerStatus(server.id, 'offline');
                        }
                        return of({});
                    })
                )
            }), toArray()).toPromise();
    }

    async register(host: string, port: number, instanceId: number, name: string) {
        try {
            if (name && name !== '' && host !== '') {
                let server = await this.repo.findOne({where: {host, name, port, instanceId: instanceId + 1}});
                if (!server) {
                    let count   = await this.repo.query('select distinct host, port, name from presence.registered_world where name = ? and NOT (host = ? AND port = ?)', [name, host, port]);
                    let world   = this.repo.create(new RegisteredWorld(host, port, instanceId + 1, name, 100, 0));
                    world.index = count.length + 1;
                    await this.repo.save(world);
                    return;
                }
                server.status = 'online';
                server.port   = port;
                await this.repo.save(server, {reload: true});
                console.log('Server ' + server.id + ' has come online.');
                return server.id;
            }
            throw new Error('No Name or Host Provided');
        } catch (e) {
            console.error(e);
            return null;
        }
    }


    async online(serverId: number) {
        await this.toggleServerStatus(serverId, 'online');
    }

    private async toggleServerStatus(serverId: number, status: 'offline' | 'online') {
        let server    = await this.repo.findOne(serverId);
        server.status = status;
        await this.userRepo.delete({serverId});
        await this.repo.save(server);
        console.log('Server ' + server.id + ' is ' + status + '.');
    }

    async offline(serverId: number) {
        await this.toggleServerStatus(serverId, 'offline');
    }

    async clear() {
        await this.repo.clear();
    }

    async getServers() {
        return await this.repo.createQueryBuilder('world')
                         .select('world.name, world.index, MAX(world.host) host, MAX(world.port) port, SUM(world.current) current, SUM(IF (world.status = "online", world.capacity, 0)) capacity, MAX(world.status) status')
                         .groupBy('world.name, world.index')
                         .orderBy('7', 'DESC')
                         .getRawMany()
    }

    async onApplicationBootstrap() {
        await this.repo.createQueryBuilder('server')
                  .delete()
                  .where('name = ""')
                  .execute();
    }

    getHost(host: string) {
        if (host.indexOf('127.0.0.1') !== -1) {
            return 'localhost';
        }
        return host;
    }

    async addUser(serverId: number, accountId: number) {
        try {
            let registeredWorld = await this.repo.findOne(serverId);
            if (registeredWorld) {
                let connected = new ConnectedUser(accountId, registeredWorld.name, serverId);
                let found     = await this.userRepo.findOne({accountId});
                if (found) {
                    connected               = found;
                    connected.world         = registeredWorld.name;
                    connected.serverId      = serverId;
                    connected.characterName = '';
                }
                await this.userRepo.save(connected, {reload: true});
                let count               = await this.getConnectedUserCount(serverId);
                registeredWorld.current = count[0].count;
                registeredWorld.full    = registeredWorld.current >= registeredWorld.capacity;
                await this.repo.save(registeredWorld);
                this.client.sendServers(await this.getServers());
                return connected.id
            }
            throw new Error("World Not Found");
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private async getConnectedUserCount(serverId: number) {
        return await this.userRepo.query('select count(1) count from presence.connected_user where serverId = ?', [serverId]);
    }

    async removeUser(serverId: number, accountId: number) {
        try {
            let registeredWorld = await this.repo.findOne(serverId);
            if (registeredWorld) {
                await this.characterLeave(accountId);
                await this.userRepo.delete({accountId});
                let count               = await this.getConnectedUserCount(serverId);
                registeredWorld.current = count[0].count;
                registeredWorld.full    = registeredWorld.current >= registeredWorld.capacity;
                await this.repo.save(registeredWorld);
                this.client.sendServers(await this.getServers());
                return "OK";
            }
        } catch (e) {
            console.error(e);
            return "ERROR";
        }
    }

    async characterJoin(accountId: number, name: string) {
        try {
            let user = await this.userRepo.findOne({accountId});
            if (user) {
                user.characterName = name;
                await this.userRepo.save(user);
                this.logger.log("The player '" + name + "' has signed in.");
                return "OK";
            }
            throw new Error("User Not Online");
        } catch (e) {
            console.error(e);
            return "ERROR";
        }
    }

    async characterLeave(accountId: number) {
        try {
            let user = await this.userRepo.findOne({accountId});
            if (user && user.characterName !== '') {
                let name           = '' + user.characterName;
                user.characterName = '';
                await this.userRepo.save(user);
                this.logger.log("The player '" + name + "' has signed out.");
                return "OK";
            }
            return "OK";
        } catch (e) {
            console.error(e);
        }
    }

}
