import { Injectable } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatesService {
  constructor(@InjectRepository(State) private readonly stateRepository:Repository<State>){

  }
  create(createStateDto: CreateStateDto) {
    return 'This action adds a new state';
  }

  async findAll():Promise<State[]> {
    return this.stateRepository.find();
  }

  async stateListByCountry(countryId:number){
    return this.stateRepository.find({
      where:{
        country_id:countryId
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} state`;
  }

  update(id: number, updateStateDto: UpdateStateDto) {
    return `This action updates a #${id} state`;
  }

  remove(id: number) {
    return `This action removes a #${id} state`;
  }
}
