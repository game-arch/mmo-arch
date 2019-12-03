import {NestFactory}    from '@nestjs/core';
import {CommerceModule} from './commerce.module';
import {createDatabase} from "../../config/db.config";
import {environment}    from "../../config/environment";
import {Logger}         from "@nestjs/common";
import {WorldConstants} from "../../config/world.constants";


const logger = new Logger(WorldConstants.NAME + ' Commerce');

async function bootstrap() {
    await createDatabase(WorldConstants.DB_NAME);
    const app = await NestFactory.createMicroservice(CommerceModule, {
        transport: environment.microservice.transport,
        options: {
            ...environment.microservice.options,
            name: WorldConstants.NAME + ' Commerce',
            queue: WorldConstants.CONSTANT + 'commerce'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log(WorldConstants.NAME + " Commerce Microservice is listening ...");
    });
}

bootstrap();
