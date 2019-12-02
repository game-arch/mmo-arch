import {Injectable}       from "@nestjs/common";
import {Repository}       from "typeorm";
import {EventEntity}      from "./entities/event";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class AuditService {

    constructor(
        @InjectRepository(EventEntity)
        private repo: Repository<EventEntity>
    ) {

    }

    async save(type: string, event: string, data: any, parentId?: number) {
        let record   = this.repo.create();
        record.type  = type;
        record.event = event;
        record.data  = JSON.stringify(data);
        if (parentId) {
            record.parentId = parentId;
        }
        await this.repo.save(record, {reload: true});
        return record.id;
    }
}
