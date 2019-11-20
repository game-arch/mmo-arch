import {NestFactory}    from '@nestjs/core';
import {ChatModule}     from './chat.module';
import {createDatabase} from "../../lib/database/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";


const logger = new Logger('Chat');

async function bootstrap() {
    await createDatabase('chat');
    const app = await NestFactory.createMicroservice(ChatModule, {
        transport: config.microservice.transport,
        options: {
            url: config.microservice.options.url,
            queue: 'chat'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Chat Microservice is listening ...");
    });
}

bootstrap();
