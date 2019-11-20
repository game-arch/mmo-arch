import { Injectable } from '@nestjs/common';

@Injectable()
export class AreaService {
  getHello(): string {
    return 'Hello World!';
  }
}
