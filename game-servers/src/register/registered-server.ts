import {Socket} from "socket.io";

export class RegisteredServer {

    constructor(public ip:string, public capacity: number, public current: number) {
    }
}
