import { NestFactory }    from "@nestjs/core";
import { PartyModule }    from "./party.module";
import { environment }    from "../../lib/config/environment";
import { Logger }         from "@nestjs/common";
import { WorldConstants } from "../../lib/constants/world.constants";

const logger = new Logger("Party");

async function bootstrap() {
  const app = await NestFactory.createMicroservice(PartyModule, {
    transport: environment.microservice.transport,
    options  : {
      ...environment.microservice.global,
      name : WorldConstants.NAME + " Party",
      queue: WorldConstants.CONSTANT + "-party"
    }
  });
  app.useLogger(logger);
  await app.listen(() => {
    logger.log("Party Microservice is listening ...");
  });
}

bootstrap();
