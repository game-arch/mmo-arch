import {Socket}       from "socket.io";
import {RedisAdapter} from "socket.io-redis";

export interface RedisSocket extends Socket {

    adapter: RedisAdapter;
}
