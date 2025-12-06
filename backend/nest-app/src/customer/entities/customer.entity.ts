import { CustomerAddress } from "src/customer-addresses/entities/customer-address.entity";
import { Role } from "src/role/entities/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    phone: string

    @Column()
    password: string

    @Column()
    role_id: number

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'role_id' })
    role: Role

    @Column({nullable:true})
    otp:string

    @Column({type:"datetime",nullable:true})
    otpExpiry:Date

    @Column({default:0})
    totalLogin:number

    @Column({default:0})
    totalAttempt:number

    @Column({default:null})
    image:string

    @Column({default:0})
    emailVerification:number

    @Column({default:0})
    phoneVerification:number

    @Column({default:0})
    status:number

    @Column({type:"datetime",default:()=>"CURRENT_TIMESTAMP"})
    addedDate:Date

    @Column({type:"datetime",nullable:true})
    lastOtpSentAt:Date

    @Column({nullable:true})
    registrationDay:string

    @OneToMany(() => CustomerAddress, (customerAddress) => customerAddress.customer_id )
    customerAddresses: CustomerAddress[];
}
