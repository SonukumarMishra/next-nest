
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column({type:'text',nullable:true})
    description:string

    @Column({type:'text',nullable:true})
    category_image:string

     @Column({default:1})
    status:number

    @OneToMany(()=>Product,(product)=>product.category)
    products:Product[]
}
