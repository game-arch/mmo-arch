import {Socket} from "socket.io";

export class User {

    constructor(
        public readonly accountId: number,
        public readonly email: string,
        public readonly socket: Socket
    ) {

    }
}
