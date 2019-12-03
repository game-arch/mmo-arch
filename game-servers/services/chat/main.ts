import {NestFactory}    from '@nestjs/core';
import {ChatModule}     from './chat.module';
import {createDatabase} from "../../lib/config/db.config";
import {environment}    from "../../lib/config/environment";
import {Logger}         from "@nestjs/common";


const logger = new Logger('Chat');

async function bootstrap() {
    await createDatabase('chat');
    const app = await NestFactory.createMicroservice(ChatModule, {
        transport: environment.microservice.transport,
        options: {
            ...environment.microservice.options,
            name: 'Chat',
            queue: 'chat'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Chat Microservice is listening ...");
    });
}

bootstrap();
