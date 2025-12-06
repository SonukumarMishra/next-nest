import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { CustomerAddress } from 'src/customer-addresses/entities/customer-address.entity';
import { Role } from 'src/role/entities/role.entity';
import { State } from 'src/states/entities/state.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('employee')
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phone: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city_id: number;

    @ManyToOne(() => City)
    @JoinColumn({ name: 'city_id' })
    city: City;

    @Column({ nullable: true })
    state_id: number;

    @ManyToOne(() => State)
    @JoinColumn({ name: 'state_id' })
    state: State;

    @Column({ nullable: true })
    country_id: number;

    @ManyToOne(() => Country)
    @JoinColumn({ name: 'country_id' })
    country: Country;

    @Column({ nullable: true })
    zip: string;

    @Column()
    role_id: number;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ nullable: true })
    otp: string;

    @Column({ type: 'datetime', nullable: true })
    otpExpiry: Date;

    @Column({ default: 0 })
    totalLogin: number;

    @Column({ default: 0 })
    totalAttempt: number;

    @Column({ default: null })
    image: string;

    @Column({ default: 0 })
    emailVerification: number;

    @Column({ default: 0 })
    salary: number;

    @Column({ default: 0 })
    phoneVerification: number;

    @Column({ default: 0 })
    status: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    addedDate: Date;

    @Column({ type: 'datetime', nullable: true })
    otpLastSentAt: Date;

    @Column({ nullable: true })
    registrationDay: string;

    @OneToMany(() => CustomerAddress, (customerAddress) => customerAddress.customer_id )
    customerAddresses: CustomerAddress[];
}
