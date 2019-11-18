import {environment} from "../environments/environment";
import {PORTS}       from "../../../../lib/constants/ports";

export class Hosts {
    static readonly ACCOUNT = environment.serverHost + ':' + PORTS.ACCOUNT;
}
