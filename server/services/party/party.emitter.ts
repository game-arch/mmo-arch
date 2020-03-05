import {ClientProxy}        from '@nestjs/microservices'
import {Inject, Injectable} from '@nestjs/common'
import {
    PartyMemberJoined,
    PartyMemberLeft,
    PartyMemberKicked,
    InvitedToParty
}                           from './actions'
import {WORLD_PREFIX}       from '../world/world.prefix'

@Injectable()
export class PartyEmitter {
    constructor(@Inject('WORLD_CLIENT') protected client: ClientProxy) {
    }

    invitedToParty(leaderId: number, characterId: number) {
        this.client.emit(
            WORLD_PREFIX + InvitedToParty.event,
            new InvitedToParty(leaderId, characterId)
        )
    }

    joinedParty(characterId: number, characterName: string, partyId: number) {
        this.client.emit(
            WORLD_PREFIX + PartyMemberJoined.event,
            new PartyMemberJoined(characterId, characterName, partyId)
        )
    }

    leftParty(characterId: number, characterName: string, partyId: number) {
        this.client.emit(
            WORLD_PREFIX + PartyMemberLeft.event,
            new PartyMemberLeft(characterId, characterName, partyId)
        )
    }


    kickedFromParty(characterId: number, partyId: number) {
        this.client.emit(
            WORLD_PREFIX + PartyMemberKicked.event,
            new PartyMemberKicked(characterId, partyId)
        )
    }
}
