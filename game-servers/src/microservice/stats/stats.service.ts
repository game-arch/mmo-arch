import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
  getHello(): string {
    return 'Hello World!';
  }
}
