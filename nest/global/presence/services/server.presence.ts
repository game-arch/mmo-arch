import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { InjectRepository }                                                  from '@nestjs/typeorm'
import { World }                                                             from '../entities/world'
import { Repository }                                                        from 'typeorm'
import { PresenceEmitter }                                                   from '../emitter/presence.emitter'
import { Subject }                                                           from 'rxjs'
import { mergeMap, throttleTime }                                            from 'rxjs/operators'
import { async }                                                             from 'rxjs/internal/scheduler/async'
import { fromPromise }                                                       from 'rxjs/internal-compatibility'
import * as fs                                                               from 'fs'
import * as path                                                             from 'path'
import { environment }                                                       from '../../../lib/config/environment'

@Injectable()
export class ServerPresence implements OnApplicationBootstrap, OnApplicationShutdown {

    sendServers = new Subject()

    constructor(
        @InjectRepository(World)
        private repo: Repository<World>,
        private logger: Logger,
        private emitter: PresenceEmitter
    ) {
    }

    async register(host: string, port: number, instanceId: number, constant: string, name: string) {
        try {
            if (name && name !== '' && host !== '') {
                let server: World
                try {
                    server        = await this.repo.findOne({ host, constant, port, instanceId: instanceId + 1 })
                    server.status = 'online'
                } catch (e) {
                    const count  = await this.repo.query('select distinct host, port, name from world where name = ? and NOT (host = ? AND port = ?)', [name, host, port])
                    server       = this.repo.create(new World(host, port, instanceId + 1, constant, name))
                    server.index = count.length + 1
                }
                await this.repo.save(server)
                this.logger.log('Server ' + server.id + ' has come online.')
                this.sendServers.next()
                return server.id
            }
            throw new Error('No Name or Host Provided')
        } catch (e) {
            this.logger.error(e)
            return null
        }
    }

    async online(serverId: number) {
        await this.toggleServerStatus(serverId, 'online')
    }

    async offline(serverId: number) {
        await this.toggleServerStatus(serverId, 'offline')
    }

    async clear() {
        await this.repo.clear()
    }

    async getWorlds() {
        const builder = this.repo.createQueryBuilder('world')
                            .select('world.name, world.index, MAX(world.host) host, MAX(world.port) port, MAX(world.status) status')
                            .groupBy('world.name, world.index')
                            .orderBy('5', 'DESC')
        return await builder.getRawMany()
    }

    async onApplicationBootstrap() {
        this.sendServers.pipe(throttleTime(1000, async, { trailing: true }))
            .pipe(mergeMap(() => fromPromise(this.getWorlds())))
            .subscribe((servers) => {
                this.emitter.sendWorlds(servers)
            })
    }

    onApplicationShutdown() {
        fs.unlinkSync(path.resolve(environment.dbRoot, 'presence.db'))
    }

    getHost(host: string) {
        if (host.indexOf('127.0.0.1') !== -1) {
            return 'localhost'
        }
        return host
    }

    private async toggleServerStatus(serverId: number, status: 'offline' | 'online') {
        await this.repo.update(serverId, { status })
        this.logger.log('Server ' + serverId + ' is ' + status + '.')
        this.sendServers.next()
    }
}
