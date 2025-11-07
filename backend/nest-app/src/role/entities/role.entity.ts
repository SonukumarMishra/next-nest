import { Employee } from "src/employee/entities/employee.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int', default: 1 })
  status: number;

   @OneToMany(() => Employee, (employee) => employee.role)
   employees: Employee[];

}
