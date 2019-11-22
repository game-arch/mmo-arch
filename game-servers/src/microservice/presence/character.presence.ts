import {Injectable, Logger} from "@nestjs/common";
import {InjectRepository}   from "@nestjs/typeorm";
import {Repository}         from "typeorm";
import {ConnectedUser}      from "./entities/connected-user";
import {PresenceClient}     from "./client/presence.client";

@Injectable()
export class CharacterPresence {

    constructor(
        @InjectRepository(ConnectedUser)
        private userRepo: Repository<ConnectedUser>,
        private logger: Logger,
        private client: PresenceClient
    ) {
    }

    async online(accountId: number, name: string) {
        try {
            let user = await this.userRepo.findOne({accountId});
            if (user) {
                let previous       = user.characterName;
                user.characterName = name;
                await this.userRepo.save(user);
                this.logger.log("The player '" + name + "' has signed in.");
                if (previous !== '' && previous !== name) {
                    this.client.sendCharacterStatus(user.serverId, user.world, user.accountId, previous, 'offline');
                }
                this.client.sendCharacterStatus(user.serverId, user.world, user.accountId, user.characterName, 'online');
                return "OK";
            }
            throw new Error("User Not Online");
        } catch (e) {
            this.logger.error(e);
            return "ERROR";
        }
    }

    async offline(accountId: number) {
        try {
            let user = await this.userRepo.findOne({accountId});
            if (user) {
                if (user.characterName !== '') {
                    let name           = '' + user.characterName;
                    user.characterName = '';
                    await this.userRepo.save(user);
                    this.logger.log("The player '" + name + "' has signed out.");
                    this.client.sendCharacterStatus(user.serverId, user.world, user.accountId, name, 'offline');
                }
                return "OK";
            }
            throw new Error("User Not Online");
        } catch (e) {
            this.logger.error(e);
            return "ERROR";
        }
    }
}
