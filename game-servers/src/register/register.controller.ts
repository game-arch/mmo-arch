import {Controller, Get, Req, Res} from '@nestjs/common';
import {RegisterService}           from './register.service';
import {Request, Response}         from "express";

@Controller()
export class RegisterController {
    constructor(private readonly service: RegisterService) {
    }

    @Get('servers')
    async getAll(@Req() req: Request, @Res() res: Response) {
        res.setHeader('Content-Type', 'application/json');
        res.send(this.service.getAll());
    }

}
