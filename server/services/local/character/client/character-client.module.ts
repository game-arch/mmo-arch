import { Module }          from '@nestjs/common'
import { CharacterClient } from './character.client'
import { ClientModule }    from '../../../../lib/client/client.module'

@Module({
    imports  : [ClientModule],
    providers: [
        CharacterClient
    ],
    exports  : [
        CharacterClient
    ]
})
export class CharacterClientModule {

}
