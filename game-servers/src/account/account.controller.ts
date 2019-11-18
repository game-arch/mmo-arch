import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import {AccountService}                  from './account.service';
import {Request, Response}               from "express";

@Controller()
export class AccountController {
    constructor(private readonly appService: AccountService) {
    }

    @Post('register')
    register(@Req() request: Request, @Res() response: Response) {

    }

    @Post('login')
    login(@Req() request: Request, @Res() response: Response) {

    }
}
