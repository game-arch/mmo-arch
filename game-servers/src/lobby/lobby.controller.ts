import { Controller, Get } from '@nestjs/common';
import { LobbyService }    from './lobby.service';

@Controller()
export class LobbyController {
  constructor(private readonly appService: LobbyService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
