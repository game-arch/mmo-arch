import {Socket}                from "socket.io";
import {WorldWebsocketService} from "./world-websocket.service";

export interface WorldWebsocket extends Socket {
    service?: WorldWebsocketService;
}
