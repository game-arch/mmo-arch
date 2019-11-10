import { NestFactory }    from '@nestjs/core';
import { RegisterModule } from './register.module';
import {RedisIoAdapter}   from "../lib/redis-io.adapter";
import {PORTS}            from "../constants";

async function bootstrap() {
  const app = await NestFactory.create(RegisterModule);
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  await app.listen(PORTS.REGISTER);
}
bootstrap();
