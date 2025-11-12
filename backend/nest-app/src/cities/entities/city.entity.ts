import { State } from "src/states/entities/state.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('cities')
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    state_id: number;

    @ManyToOne(() => State)
    @JoinColumn({ name: 'state_id' })
    state: State;
}
