import {NestFactory}     from '@nestjs/core';
import {CharacterModule} from './character.module';
import {createDatabase}  from "../../config/db.config";
import {environment}     from "../../config/environment";
import {Logger}          from "@nestjs/common";


const logger = new Logger('Character');

async function bootstrap() {
    await createDatabase('character');
    const app = await NestFactory.createMicroservice(CharacterModule, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.options,
            name : 'Character',
            queue: 'character'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Character Microservice is listening ...");
    });
}

bootstrap();
