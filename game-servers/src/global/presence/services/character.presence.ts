import {Injectable, Logger} from "@nestjs/common";
import {InjectRepository}   from "@nestjs/typeorm";
import {Repository}         from "typeorm";
import {ConnectedUser}      from "../entities/connected-user";
import {PresenceClient}     from "../client/presence.client";
import {PresenceEmitter}    from "../emitter/presence.emitter";

@Injectable()
export class CharacterPresence {

    constructor(
        @InjectRepository(ConnectedUser)
        private userRepo: Repository<ConnectedUser>,
        private logger: Logger,
        private emitter: PresenceEmitter
    ) {
    }

    async online(accountId: number, name: string) {
        await this.switchCharacterNameFor(accountId, name);
    }

    async offline(accountId: number) {
        await this.switchCharacterNameFor(accountId, '');
    }

    private async updateCharacterNameForUser(user, name: string) {
        let previousName = user.characterName + '';
        if (user.characterName !== name) {
            user.characterName = name;
            await this.userRepo.save(user);
        }
        this.updateStatuses(previousName, name, user);
    }

    private updateStatuses(previousName: string, nextName: string, user) {
        if (previousName !== '' && previousName !== nextName) {
            this.emitter.sendCharacterStatus(user.world, {...user, characterName: previousName}, 'offline');
            this.logger.log("The player '" + previousName + "' has signed out.");
        }
        if (nextName !== '') {
            this.emitter.sendCharacterStatus(user.world, user, 'online');
            this.logger.log("The player '" + nextName + "' has signed in.");
        }
    }

    async switchCharacterNameFor(accountId: number, nextName: string) {
        try {
            let user = await this.userRepo.findOne({accountId});
            if (user) {
                await this.updateCharacterNameForUser(user, nextName);
                return "OK";
            }
            throw new Error("User Not Online");
        } catch (e) {
            this.logger.error(e);
            return "ERROR";
        }

    }
}
