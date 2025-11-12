import { Employee } from "src/employee/entities/employee.entity";
import { State } from "src/states/entities/state.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('countries')
export class Country {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: null })
    shortname: string;

    @Column()
    name: string;

    @Column()
    phonecode: number;

    @OneToMany(() => State, (state) => state.country)
    states: State[];

    @OneToMany(() => Employee, (employee) => employee.country)
    employees: Employee[];
}
