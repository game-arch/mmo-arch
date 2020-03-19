import {Module}                from '@nestjs/common'
import {MapController}         from './map.controller'
import {MapService}            from './map.service'
import {TypeOrmModule}         from '@nestjs/typeorm'
import {Player}                from './entities/player'
import {Resource}              from './entities/resource'
import {ResourceDrop}          from './entities/resource-drop'
import {NpcLocation}           from './entities/npc-location'
import {ResourceLocation}      from './entities/resource-location'
import {WorldConstants}        from '../../lib/constants/world.constants'
import {MapEmitter}            from './map.emitter'
import {CharacterClientModule} from '../character/client/character-client.module'
import {MapTransition}         from './entities/map-transition'
import {MapConstants}          from './constants'
import * as path               from 'path'
import {environment}           from '../../lib/config/environment'
import {ClientModule}          from '../../client/client.module'
import {TUTORIAL_CONFIG}       from "../../../shared/maps/tutorial";
import {TUTORIAL_2_CONFIG}     from "../../../shared/maps/tutorial-2";
import {BaseScene}             from "../../../shared/phaser/base.scene";

@Module({
    imports    : [
        ClientModule,
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
            provide   : 'tutorial',
            useFactory: () => new BaseScene(TUTORIAL_CONFIG)
        },
        {
            provide   : 'tutorial-2',
            useFactory: () => new BaseScene(TUTORIAL_2_CONFIG)
        }
    ]
})
export class MapModule {
}
