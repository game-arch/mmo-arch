import { ClientProxyFactory } from '@nestjs/microservices'
import { environment }        from '../config/environment'

export function createMicroserviceClient(label: string, queueType: 'global' | 'local') {
    return ClientProxyFactory.create({
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice[queueType],
        },
    } as any)
}
