import { Module }                from '@nestjs/common'
import { MapController }         from './map.controller'
import { MapService }            from './map.service'
import { TypeOrmModule }         from '@nestjs/typeorm'
import { Player }                from './entities/player'
import { Resource }              from './entities/resource'
import { ResourceDrop }          from './entities/resource-drop'
import { NpcLocation }           from './entities/npc-location'
import { ResourceLocation }      from './entities/resource-location'
import { WorldConstants }        from '../../../lib/constants/world.constants'
import { TutorialMap }           from './maps/tutorial.map'
import { WorldClientModule }     from '../../../lib/world-client/world-client.module'
import { MapEmitter }            from './map.emitter'
import { CharacterClientModule } from '../character/client/character-client.module'
import { MapTransition }         from './entities/map-transition'
import { MapConstants }          from './constants'
import * as path                 from 'path'
import { environment }           from '../../../lib/config/environment'

@Module({
    imports    : [
        WorldClientModule,
        CharacterClientModule,
        TypeOrmModule.forFeature([MapTransition, Resource, ResourceDrop, NpcLocation, ResourceLocation, Player]),
        TypeOrmModule.forRoot({
            type       : 'sqlite',
            database   : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + '_' + MapConstants.MAP + '.db'),
            logging    : false,
            synchronize: true,
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [MapController],
    providers  : [
        MapService,
        MapEmitter,
        {
            provide : 'tutorial',
            useClass: TutorialMap
        }
    ]
})
export class MapModule {
}
