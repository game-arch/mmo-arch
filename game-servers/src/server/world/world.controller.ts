import {Controller, Get, Req, Res} from '@nestjs/common';
import {WorldService}              from './world.service';
import {Request, Response}         from "express";

@Controller()
export class WorldController {
    constructor(
        private readonly appService: WorldService
    ) {
    }
}
