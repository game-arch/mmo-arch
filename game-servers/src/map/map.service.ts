import { Injectable } from '@nestjs/common';

@Injectable()
export class MapService {
  getHello(): string {
    return 'Hello World!';
  }
}
