import { Controller, Get } from '@nestjs/common';
import { MapService }      from './map.service';

@Controller()
export class MapController {
  constructor(private readonly appService: MapService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
