import { Injectable } from '@nestjs/common';

@Injectable()
export class CharacterService {
  getHello(): string {
    return 'Hello World!';
  }
}
