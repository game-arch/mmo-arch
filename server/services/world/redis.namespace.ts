import {Namespace}    from "socket.io";
import {RedisAdapter} from "socket.io-redis";

export interface RedisNamespace extends Namespace {
    adapter: RedisAdapter;
}
