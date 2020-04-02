import { Controller, Logger }                    from '@nestjs/common'
import { EventPattern }                          from '@nestjs/microservices'
import { CharacterLoggedIn, CharacterLoggedOut } from '../../../../shared/events/character.events'
import { CharacterGateway }                      from './character.gateway'
import { MapOnline }  from '../../../../shared/events/map.events'
import { WorldEvent } from '../event.types'

@Controller()
export class CharacterController {


    constructor(
        private logger: Logger,
        private gateway: CharacterGateway
    ) {

    }

    @EventPattern(new WorldEvent(MapOnline.event))
    async onMapOnline(data: MapOnline) {
        await this.gateway.sendCharacters(data)
    }


    @EventPattern(new WorldEvent(CharacterLoggedIn.event))
    onCharacterJoin(data: CharacterLoggedIn) {
        this.logger.log(data.name + ' is online.')
        this.gateway.server.emit(CharacterLoggedIn.event, data)
    }

    @EventPattern(new WorldEvent(CharacterLoggedOut.event))
    onCharacterLeave(data: CharacterLoggedOut) {
        this.logger.log(data.name + ' is offline.')
        this.gateway.server.emit(CharacterLoggedOut.event, data)
    }
}
