import {environment} from "../environments/environment";
import {PORTS}       from "../../../../../game-servers/lib/constants/ports";

export class Hosts {
    static readonly LOBBY = environment.serverHost + ':' + PORTS.LOBBY;
}
