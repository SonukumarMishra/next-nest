import { City } from "src/cities/entities/city.entity";
import { Country } from "src/countries/entities/country.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('states')
export class State {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    country_id: number;

    @ManyToOne(() => Country)
    @JoinColumn({ name: 'country_id' })
    country: Country;

    @OneToMany(() => City, (city) => city.state)
    cities: City[];
}
