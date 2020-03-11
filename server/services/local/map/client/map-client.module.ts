import { Module }       from '@nestjs/common'
import { MapClient }    from './map.client'
import { ClientModule } from '../../../../lib/client/client.module'

@Module({
    imports  : [ClientModule],
    providers: [
        MapClient
    ],
    exports  : [
        MapClient
    ]
})
export class MapClientModule {

}
