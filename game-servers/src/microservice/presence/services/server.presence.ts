import {HttpService, Injectable, Logger, OnApplicationBootstrap} from "@nestjs/common";
import {InjectRepository}                                        from "@nestjs/typeorm";
import {RegisteredWorld}                                         from "../entities/registered-world";
import {Repository}                                              from "typeorm";
import {ConnectedUser}                                           from "../entities/connected-user";
import {PresenceEmitter}                                         from "../emitter/presence.emitter";
import {Subject}                                                 from "rxjs";
import {mergeMap, throttleTime}                                  from "rxjs/operators";
import {async}                                                   from "rxjs/internal/scheduler/async";
import {fromPromise}                                             from "rxjs/internal-compatibility";

@Injectable()
export class ServerPresence implements OnApplicationBootstrap {

    sendServers = new Subject();

    constructor(
        private http: HttpService,
        @InjectRepository(RegisteredWorld)
        private repo: Repository<RegisteredWorld>,
        @InjectRepository(ConnectedUser)
        private userRepo: Repository<ConnectedUser>,
        private logger: Logger,
        private emitter: PresenceEmitter
    ) {
    }

    async register(host: string, port: number, instanceId: number, name: string) {
        try {
            if (name && name !== '' && host !== '') {
                let server: RegisteredWorld;
                try {
                    await this.repo.update({host, name, port, instanceId: instanceId + 1}, {status: 'online'});
                    server = await this.repo.findOne({host, name, port, instanceId: instanceId + 1});
                } catch (e) {
                    let count    = await this.repo.query('select distinct host, port, name from presence.registered_world where name = ? and NOT (host = ? AND port = ?)', [name, host, port]);
                    server       = this.repo.create(new RegisteredWorld(host, port, instanceId + 1, name, 100));
                    server.index = count.length + 1;
                    await this.repo.save(server);
                }
                this.logger.log('Server ' + server.id + ' has come online.');
                this.sendServers.next();
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
        await this.repo.update(serverId, {status});
        await this.userRepo.delete({serverId});
        this.logger.log('Server ' + serverId + ' is ' + status + '.');
        this.sendServers.next();
    }

    async offline(serverId: number) {
        await this.toggleServerStatus(serverId, 'offline');
    }

    async clear() {
        await this.repo.clear();
        await this.userRepo.clear();
    }

    async getServers() {
        let builder = this.repo.createQueryBuilder('world')
                          .select('world.name, world.index, MAX(world.host) host, MAX(world.port) port, COUNT(user.accountId) current, SUM(IF (world.status = "online", world.capacity, 0)) capacity, MAX(world.status) status')
                          .leftJoin(ConnectedUser, 'user', 'user.serverId = world.id')
                          .groupBy('world.name, world.index')
                          .orderBy('7', 'DESC');
        return await builder.getRawMany();
    }

    async onApplicationBootstrap() {
        this.sendServers.pipe(throttleTime(1000, async, {leading: true, trailing: true}))
            .pipe(mergeMap(() => fromPromise(this.getServers())))
            .subscribe((servers) => {
                this.emitter.sendServers(servers);
            })
    }

    getHost(host: string) {
        if (host.indexOf('127.0.0.1') !== -1) {
            return 'localhost';
        }
        return host;
    }
}
