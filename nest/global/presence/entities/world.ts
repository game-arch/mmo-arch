import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Unique('instance', ['constant', 'host', 'port', 'instanceId'])
@Entity()
export class World {

    @PrimaryGeneratedColumn()
    id: number
    @Column({ default: null })
    instanceId: number
    @Column({ default: 1 })
    index: number
    @Column()
    host: string
    @Column('int')
    port: number
    @Column({ nullable: false })
    constant: string
    @Column({ nullable: false })
    name: string
    @Column({ nullable: false })
    status: 'online' | 'offline' = 'online'

    constructor(host: string, port: number, instanceId: number, constant: string, name: string) {
        this.host       = host
        this.port       = port
        this.instanceId = instanceId
        this.constant   = constant
        this.name       = name
    }
}
