import {Injectable} from '@nestjs/common';

@Injectable()
export class ShardService {
    getHello(): string {
        return 'Hello World! Works!';
    }
}
