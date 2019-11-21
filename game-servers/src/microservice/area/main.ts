import {NestFactory}    from '@nestjs/core';
import {AreaModule}     from './area.module';
import {createDatabase} from "../../lib/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";


const logger = new Logger('Area');

async function bootstrap() {
    await createDatabase('area');
    const app = await NestFactory.createMicroservice(AreaModule, {
        transport: config.microservice.transport,
        options  : {
            ...config.microservice.options,
            queue: 'area'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Area Microservice is listening ...");
    });
}

bootstrap();
