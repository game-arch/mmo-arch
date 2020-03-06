import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Item }                                               from "./item";

@Entity()
export class ItemConfiguration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Item, i => i.configurations)
  items: Item[];

  @Column()
  key: string;

  @Column()
  value: string;
}
