import { City } from "src/cities/entities/city.entity"
import { Country } from "src/countries/entities/country.entity"
import { State } from "src/states/entities/state.entity"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity('customerAddresses')
export class CustomerAddress {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    customer_id:number

    @Column()
    name:string

    @Column()
    phone:string

    @Column()
    address:string

    @Column()
    street:string

    @Column()
    country_id:number

    @ManyToOne(()=>Country)
    @JoinColumn({name:'country_id'})
    country:Country;

    @Column({nullable:true})
    state_id:number

    @ManyToOne(()=>State)
    @JoinColumn({name:'state_id'})
    state:State;


    @Column({nullable:true})
    city_id:string

    @ManyToOne(()=>City)
    @JoinColumn({name:'city_id'})
    city:City;


    @Column()
    pincode:string

    @Column()
    is_default:number

    @Column()
    status:number

    @Column({type:"datetime",nullable:true})
    addedDate:Date

    @Column({type:"datetime",nullable:true})
    modifiedDate:Date
}
 
