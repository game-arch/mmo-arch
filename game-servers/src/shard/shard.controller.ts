import {Controller, Get, Req, Res} from '@nestjs/common';
import {ShardService}              from './shard.service';
import {Request, Response}         from "express";

@Controller()
export class ShardController {
    constructor(
        private readonly appService: ShardService
    ) {
    }
}
