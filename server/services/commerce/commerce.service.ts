import { Injectable } from "@nestjs/common";

@Injectable()
export class CommerceService {
    getHello(): string {
        return "Hello World!";
    }
}
