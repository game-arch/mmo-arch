import { Controller }   from "@nestjs/common";
import { QuestService } from "./quest.service";

@Controller()
export class QuestController {
  constructor(private readonly service: QuestService) {
  }

}
