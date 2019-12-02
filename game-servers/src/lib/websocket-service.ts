import {Server, Socket} from "socket.io";

export class WebsocketService {

    constructor(protected server: Server, protected client: Socket) {

    }

}
