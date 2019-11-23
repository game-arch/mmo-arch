import { Injectable } from '@nestjs/common';

@Injectable()
export class PhysicsService {
  getHello(): string {
    return 'Hello World!';
  }
}
