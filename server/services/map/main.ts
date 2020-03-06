import "@geckos.io/phaser-on-nodejs";
import "phaser";
import { NestFactory }    from "@nestjs/core";
import { MapModule }      from "./map.module";
import { environment }    from "../../lib/config/environment";
import { Logger }         from "@nestjs/common";
import { WorldConstants } from "../../lib/constants/world.constants";

const logger = new Logger(WorldConstants.NAME + " Map");

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MapModule, {
    transport: environment.microservice.transport,
    options  : {
      ...environment.microservice.local,
      name : WorldConstants.NAME + " Map",
      queue: WorldConstants.CONSTANT + "-map"
    }
  });
  app.useLogger(logger);
  await app.enableShutdownHooks();
  await app.listen(() => {
    logger.log(WorldConstants.NAME + " Map Microservice is listening ...");
  });
}

bootstrap();
