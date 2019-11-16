import {Controller, Get}   from '@nestjs/common';
import {ShardService}      from './shard.service';
import {Repository}        from "typeorm";
import {Item}              from "./entities/item";
import {ItemConfiguration} from "./entities/item-configuration";
import {InjectRepository}  from "@nestjs/typeorm";

@Controller()
export class ShardController {
    constructor(
        private readonly appService: ShardService
    ) {
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
