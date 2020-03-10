import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index("resourceMap", ["map"])
@Index("resourceLocation", ["map", "x", "y"])
export class ResourceLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    resourceId: number;
    @Column()
    map: string;
    @Column("int")
    x: number;
    @Column("int")
    y: number;
}
