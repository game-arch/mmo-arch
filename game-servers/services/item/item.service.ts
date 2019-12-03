import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemService {
  getHello(): string {
    return 'Hello World!';
  }
}
