import { Module }        from '@nestjs/common';
import { MapController } from './map.controller';
import { MapService }    from './map.service';
import {DATABASE_MODULE} from "../lib/database/database.module";

@Module({
  imports    : [DATABASE_MODULE('map', __dirname)],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
