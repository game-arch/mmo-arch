import {HttpService, Injectable, Logger} from "@nestjs/common";
import {InjectRepository}                from "@nestjs/typeorm";
import {RegisteredWorld}                 from "./entities/registered-world";
import {Repository}                      from "typeorm";
import {ConnectedUser}                   from "./entities/connected-user";
import {PresenceClient}                  from "./client/presence.client";
import {from, of}                        from "rxjs";
import {catchError, mergeMap, toArray}   from "rxjs/operators";

@Injectable()
export class ServerPresence {

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
        let servers = await this.repo.find({status: 'online'});
        let changed = false;
        await from(servers || [])
            .pipe(mergeMap(server => {
                return this.http.get('http://' + server.host + ':' + server.port + '/health').pipe(
                    catchError(err => {
                        if (server.status === 'online') {
                            this.toggleServerStatus(server.id, 'offline');
                            changed = true;
                        }
                        return of({});
                    })
                )
            }), toArray()).toPromise();
        if (changed) {
            this.client.sendServers(await this.getServers());
        }
    }

    async register(host: string, port: number, instanceId: number, name: string) {
        try {
            if (name && name !== '' && host !== '') {
                let server = await this.repo.findOne({where: {host, name, port, instanceId: instanceId + 1}});
                if (!server) {
                    let count   = await this.repo.query('select distinct host, port, name from presence.registered_world where name = ? and NOT (host = ? AND port = ?)', [name, host, port]);
                    let world   = this.repo.create(new RegisteredWorld(host, port, instanceId + 1, name, 100));
                    world.index = count.length + 1;
                    await this.repo.save(world);
                } else {
                    server.status = 'online';
                    server.port   = port;
                    await this.repo.save(server, {reload: true});
                }
                this.logger.log('Server ' + server.id + ' has come online.');
                this.client.sendServers(await this.getServers());
                return server.id;
            }
            throw new Error('No Name or Host Provided');
        } catch (e) {
            this.logger.error(e);
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
        this.logger.log('Server ' + server.id + ' is ' + status + '.');
    }

    async offline(serverId: number) {
        await this.toggleServerStatus(serverId, 'offline');
    }

    async clear() {
        await this.repo.clear();
        await this.userRepo.clear();
    }

    async getServers() {
        return await this.repo.createQueryBuilder('world')
                         .select('world.name, world.index, MAX(world.host) host, MAX(world.port) port, COUNT(user.accountId) current, SUM(IF (world.status = "online", world.capacity, 0)) capacity, MAX(world.status) status')
                         .leftJoin(ConnectedUser, 'user', 'user.serverId = world.id')
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
}
