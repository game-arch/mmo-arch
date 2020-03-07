import { NestFactory }    from "@nestjs/core";
import { CommerceModule } from "./commerce.module";
import { environment }    from "../../lib/config/environment";
import { Logger }         from "@nestjs/common";
import { WorldConstants } from "../../lib/constants/world.constants";


const logger = new Logger(WorldConstants.NAME + " Commerce");

async function bootstrap() {
    const app = await NestFactory.createMicroservice(CommerceModule, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.global,
            name : WorldConstants.NAME + " Commerce",
            queue: WorldConstants.CONSTANT + "-commerce"
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log(WorldConstants.NAME + " Commerce Microservice is listening ...");
    });
}

bootstrap();
