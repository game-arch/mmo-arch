import { Controller, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { InjectRepository }                                          from '@nestjs/typeorm'
import { Item }                                                      from './entities/item'
import { Repository }                                                from 'typeorm'
import { ARMORS }                                                    from './fixtures/armors'

@Controller()
export class ItemController implements OnApplicationShutdown, OnApplicationBootstrap {

    constructor(@InjectRepository(Item) private repo: Repository<Item>) {
    }

    async onApplicationBootstrap() {
        if (await this.repo.count() === 0) {
            for (let item of ARMORS) {
                await this.repo.save(item)
            }
        }
    }

    onApplicationShutdown(signal?: string) {
    }


}
