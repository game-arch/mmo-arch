import {Injectable} from "@nestjs/common";
import {AiEmitter}  from "./ai.emitter";
import {MapClient}  from "../map/client/map.client";

@Injectable()
export class MovementService {

    constructor(private emitter: AiEmitter, private map: MapClient) {

    }
}
