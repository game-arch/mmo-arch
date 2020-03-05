import {Controller}                                                                        from "@nestjs/common";
import {PartyGateway}                                                                      from "./party.gateway";

@Controller()
export class PartyController {

    constructor(
        private gateway: PartyGateway
    ) {

    }
}
