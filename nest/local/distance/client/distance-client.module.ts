import { Module }         from '@nestjs/common'
import { ClientModule }   from '../../../client/client.module'
import { DistanceClient } from './distance.client'

@Module({
    imports  : [ClientModule],
    providers: [
        DistanceClient
    ],
    exports  : [
        DistanceClient
    ]
})
export class DistanceClientModule {

}
