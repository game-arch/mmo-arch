import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'
import * as bcrypt                                                                            from 'bcryptjs'

@Entity()
@Unique('email', ['email'])
export class Account {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string
    @Column()
    password: string

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    verifyPassword(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password)
    }
}
