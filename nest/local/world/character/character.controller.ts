import { Controller, Logger }                    from '@nestjs/common'
import { EventPattern }                          from '@nestjs/microservices'
import { CharacterLoggedIn, CharacterLoggedOut } from '../../../../shared/actions/character.actions'
import { CharacterGateway }                      from './character.gateway'
import { MapOnline }  from '../../../../shared/actions/map.actions'
import { WorldEvent } from '../../../lib/event.types'

@Controller()
export class CharacterController {


    constructor(
        private logger: Logger,
        private gateway: CharacterGateway
    ) {

    }

    @EventPattern(new WorldEvent(MapOnline.type))
    async onMapOnline(data: MapOnline) {
        await this.gateway.sendCharacters(data)
    }


    @EventPattern(new WorldEvent(CharacterLoggedIn.type))
    onCharacterJoin(data: CharacterLoggedIn) {
        this.logger.log(data.name + ' is online.')
        this.gateway.server.emit(CharacterLoggedIn.type, data)
    }

    @EventPattern(new WorldEvent(CharacterLoggedOut.type))
    onCharacterLeave(data: CharacterLoggedOut) {
        this.logger.log(data.name + ' is offline.')
        this.gateway.server.emit(CharacterLoggedOut.type, data)
    }
}
