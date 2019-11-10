import { Module }             from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService }    from './register.service';

@Module({
  imports: [],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
