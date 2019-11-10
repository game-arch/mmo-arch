import { Controller, Get } from '@nestjs/common';
import { AccountService }  from './account.service';

@Controller()
export class AccountController {
  constructor(private readonly appService: AccountService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
