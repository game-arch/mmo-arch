import {NestFactory}     from '@nestjs/core';
import {CharacterModule} from './character.module';
import {createDatabase}  from "../../lib/database/database.module";
import {config}          from "../../lib/config";
import {Logger}          from "@nestjs/common";


const logger = new Logger('Character');

async function bootstrap() {
    await createDatabase('character');
    const app = await NestFactory.createMicroservice(CharacterModule, config.microservice);
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Character Microservice is listening ...");
    });
}

bootstrap();
