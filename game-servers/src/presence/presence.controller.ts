import {Controller, Get, Req, Res} from '@nestjs/common';
import {PresenceService}           from './presence.service';
import {Request, Response}         from "express";

@Controller()
export class PresenceController {
    constructor(private readonly service: PresenceService) {
    }

    @Get('servers')
    async getServers(@Req() req: Request, @Res() res: Response) {
        res.setHeader('Content-Type', 'application/json');
        res.send(await this.service.getServers());
    }

}
