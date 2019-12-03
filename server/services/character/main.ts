import {NestFactory}     from '@nestjs/core';
import {CharacterModule} from './character.module';
import {createDatabase}  from "../../lib/config/db.config";
import {environment}     from "../../lib/config/environment";
import {Logger}          from "@nestjs/common";
import {WorldConstants}  from "../../lib/constants/world.constants";


const logger = new Logger('Character');

async function bootstrap() {
    await createDatabase('character');
    const app = await NestFactory.createMicroservice(CharacterModule, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.options,
            name : WorldConstants.NAME + ' Character',
            queue: WorldConstants.CONSTANT + '-character'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Character Microservice is listening ...");
    });
}

bootstrap();
