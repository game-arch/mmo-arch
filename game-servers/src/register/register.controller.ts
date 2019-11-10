import { Controller, Get } from '@nestjs/common';
import { RegisterService } from './register.service';

@Controller()
export class RegisterController {
  constructor(private readonly appService: RegisterService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
