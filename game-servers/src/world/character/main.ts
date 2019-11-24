import {NestFactory}     from '@nestjs/core';
import {CharacterModule} from './character.module';
import {createDatabase}  from "../../lib/database.module";
import {config}          from "../../lib/config";
import {Logger}          from "@nestjs/common";
import {WorldConstants}  from "../constants";


const logger = new Logger(WorldConstants.NAME + ' Character');

async function bootstrap() {
    await createDatabase(WorldConstants.DB_PREFIX + '_character');
    const app = await NestFactory.createMicroservice(CharacterModule,{
        transport: config.microservice.transport,
        options: {
            ...config.microservice.options,
            queue: WorldConstants.CONSTANT + '.character'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log(WorldConstants.NAME + " Character Microservice is listening ...");
    });
}

bootstrap();
