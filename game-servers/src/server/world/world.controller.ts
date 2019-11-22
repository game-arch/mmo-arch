import {Controller, Get} from '@nestjs/common';

@Controller()
export class WorldController {

    @Get('health')
    health() {
        return "OK";
    }
}
