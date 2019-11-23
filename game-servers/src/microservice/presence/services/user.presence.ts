import {Injectable, Logger} from '@nestjs/common';
import {RegisteredWorld}    from "../entities/registered-world";
import {Repository}         from "typeorm";
import {InjectRepository}   from "@nestjs/typeorm";
import {ConnectedUser}      from "../entities/connected-user";
import {ServerPresence}     from "./server.presence";
import {PresenceEmitter}    from "../emitter/presence.emitter";

@Injectable()
export class UserPresence {

    constructor(
        private server: ServerPresence,
        @InjectRepository(RegisteredWorld)
        private repo: Repository<RegisteredWorld>,
        @InjectRepository(ConnectedUser)
        private userRepo: Repository<ConnectedUser>,
        private logger: Logger,
        private emitter: PresenceEmitter
    ) {
    }

    async online(serverId: number, accountId: number) {
        try {
            let registeredWorld = await this.repo.findOne(serverId);
            if (registeredWorld) {
                let connected = new ConnectedUser(accountId, registeredWorld.name, serverId);
                await this.userRepo.delete({accountId});
                await this.userRepo.save(connected, {reload: true});
                await this.repo.save(registeredWorld);
                this.server.sendServers.next();
                return connected.id
            }
            throw new Error("World Not Found");
        } catch (e) {
            this.logger.error(e);
            return null;
        }
    }

    async offline(serverId: number, accountId: number) {
        try {
            let registeredWorld = await this.repo.findOne(serverId);
            if (registeredWorld) {
                await this.userRepo.delete({accountId});
                await this.repo.save(registeredWorld);
                this.server.sendServers.next();
                return "OK";
            }
            throw new Error("World Not Found: " + serverId);
        } catch (e) {
            this.logger.error(e);
            return "ERROR";
        }
    }

}
