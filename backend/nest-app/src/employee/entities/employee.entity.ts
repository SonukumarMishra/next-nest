import { Role } from 'src/role/entities/role.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'employee' })
export class Employee {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  phone: string

  @Column()
  password: string

  @Column({ nullable: true })
  address: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  state: string

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  zip: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
  

  @Column()
  otp: string

  @Column({ type: "datetime", default: null })
  otpExpiry: Date

  @Column({ default: 0 })
  totalLogin: number

  @Column({ default: 0 })
  totalAttempt: number

  @Column({ default: null })
  image: string

  @Column({ default: 0 })
  emailVerification: number

  @Column({ default: 0 })
  salary: number

  @Column({ default: 0 })
  phoneVerification: number

  @Column({ default: 0 })
  status: number

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  addedDate: Date

  @Column({ type: 'datetime', nullable: true })
  otpLastSentAt: Date;

  @Column({ default: null })
  registrationDay: string
}
