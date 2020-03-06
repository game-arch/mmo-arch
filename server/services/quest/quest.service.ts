import { Injectable } from "@nestjs/common";

@Injectable()
export class QuestService {
  getHello(): string {
    return "Hello World!";
  }
}
