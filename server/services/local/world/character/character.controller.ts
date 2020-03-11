import { Controller, Logger }                                      from '@nestjs/common'
import { EventPattern }                                            from '@nestjs/microservices'
import { CharacterDetails, CharacterLoggedIn, CharacterLoggedOut } from '../../character/actions'
import { CharacterGateway }                                        from './character.gateway'
import { MapOnline }                                               from '../../map/actions'
import { WORLD_PREFIX }                                            from '../world.prefix'

@Controller()
export class CharacterController {


    constructor(
        private logger: Logger,
        private gateway: CharacterGateway,
    ) {

    }

    @EventPattern(WORLD_PREFIX + MapOnline.event)
    async onMapOnline() {
        await this.gateway.sendCharacters()
    }

    @EventPattern(WORLD_PREFIX + CharacterDetails.event)
    onCharacterDetails(data: CharacterDetails) {
        this.gateway.server.emit(CharacterDetails.event, data)
    }

    @EventPattern(WORLD_PREFIX + CharacterLoggedIn.event)
    onCharacterJoin(data: CharacterLoggedIn) {
        this.logger.log(data.name + ' is online.')
        this.gateway.server.emit(CharacterLoggedIn.event, data)
    }

    @EventPattern(WORLD_PREFIX + CharacterLoggedOut.event)
    onCharacterLeave(data: CharacterLoggedOut) {
        this.logger.log(data.name + ' is offline.')
        this.gateway.server.emit(CharacterLoggedOut.event, data)
    }
}
