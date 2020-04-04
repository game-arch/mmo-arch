import { Logger, Module }        from '@nestjs/common'
import { WorldController }       from './world.controller'
import { WorldService }          from './world.service'
import { WorldGateway }          from './world.gateway'
import { AccountClientModule }   from '../../global/account/client/account-client.module'
import { CharacterClientModule } from '../character/client/character-client.module'
import { PresenceClientModule }  from '../../global/presence/client/presence-client.module'
import { MapClientModule }       from '../map/client/map-client.module'
import { MapController }         from './map/map.controller'
import { MapGateway }            from './map/map.gateway'
import { CharacterGateway }      from './character/character.gateway'
import { CharacterController }   from './character/character.controller'
import { ChatController }        from './chat/chat.controller'
import { ChatGateway }           from './chat/chat.gateway'
import { TypeOrmModule }         from '@nestjs/typeorm'
import { Player }                from './entities/player'
import { WorldConstants }        from '../../lib/constants/world.constants'
import { PartyController }       from './party/party.controller'
import { PartyGateway }          from './party/party.gateway'
import { PartyClientModule }     from '../party/client/party-client.module'
import { ClientModule }          from '../../client/client.module'
import { DB_CONFIG }             from '../../lib/config/db.config'
import { ConnectionOptions }     from 'typeorm'
import { ItemClientModule }      from '../item/client/item-client.module'
import { CommandClientModule }   from '../command/client/command-client.module'
import { CommandGateway }        from './command/command.gateway'
import { CommandController }     from './command/command.controller'

@Module({
    imports    : [
        ClientModule,
        TypeOrmModule.forRoot(<ConnectionOptions>{
            ...DB_CONFIG,
            database: WorldConstants.DB_NAME,
            entities: [__dirname + '/entities/*{.ts,.js}']
        }),
        TypeOrmModule.forFeature([Player]),
        AccountClientModule,
        CharacterClientModule,
        PresenceClientModule,
        MapClientModule,
        PartyClientModule,
        ItemClientModule,
        CommandClientModule
    ],
    controllers: [
        WorldController,
        MapController,
        CharacterController,
        ChatController,
        PartyController,
        CommandController
    ],
    providers  : [
        WorldService,
        WorldGateway,
        MapGateway,
        CharacterGateway,
        ChatGateway,
        Logger,
        PartyGateway,
        CommandGateway
    ]
})
export class WorldModule {
}
