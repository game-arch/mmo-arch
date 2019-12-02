import {Socket}                from "socket.io";
import {WorldWebsocketService} from "./tasks/world-websocket.service";

export interface WorldWebsocket extends Socket {
    service?: WorldWebsocketService;
}
