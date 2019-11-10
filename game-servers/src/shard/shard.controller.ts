import { Controller, Get } from '@nestjs/common';
import { ShardService }    from './shard.service';

@Controller()
export class ShardController {
  constructor(private readonly appService: ShardService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
