import { Injectable } from '@nestjs/common';

@Injectable()
export class RegisterService {
  getHello(): string {
    return 'Hello World!';
  }
}
