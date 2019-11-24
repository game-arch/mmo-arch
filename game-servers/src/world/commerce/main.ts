import {NestFactory}    from '@nestjs/core';
import {CommerceModule} from './commerce.module';
import {createDatabase} from "../../lib/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";
import {WorldConstants} from "../constants";


const logger = new Logger(WorldConstants.NAME + ' Commerce');

async function bootstrap() {
    await createDatabase(WorldConstants.DB_PREFIX + '_commerce');
    const app = await NestFactory.createMicroservice(CommerceModule, {
        transport: config.microservice.transport,
        options: {
            ...config.microservice.options,
            queue: WorldConstants.CONSTANT + 'commerce'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log(WorldConstants.NAME + " Commerce Microservice is listening ...");
    });
}

bootstrap();
