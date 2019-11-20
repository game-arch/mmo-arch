import { Injectable } from '@nestjs/common';

@Injectable()
export class LobbyService {
  getHello(): string {
    return 'Hello World!';
  }
}
