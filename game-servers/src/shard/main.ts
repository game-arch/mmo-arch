import {NestFactory}    from '@nestjs/core';
import {ShardModule}    from './shard.module';
import {createDatabase} from "../lib/database/database.module";
import {config}         from "../lib/config";

async function bootstrap() {
    await createDatabase('shard');
    const app = await NestFactory.create(ShardModule);
    app.enableCors({
        origin     : true,
        credentials: true
    });

    await app.listen(config.servers.shard.port);
}

bootstrap();
