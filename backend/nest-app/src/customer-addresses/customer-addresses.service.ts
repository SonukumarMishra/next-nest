import { ILike, Repository } from "typeorm";
import { CreateCustomerAddressDto } from "./dto/create-customer-address.dto";
import { CustomerAddress } from "./entities/customer-address.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { UpdateCustomerAddressDto } from "./dto/update-customer-address.dto";

@Injectable()
export class CustomerAddressesService {
  constructor(
    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
  ) { }

  async getCustomerAddressList(body: { customer_id?: number, page?: number, pageSize?: number, search?: string }) {
    const { customer_id, page, pageSize, search } = body;
    const skip = page && pageSize ? (page - 1) * pageSize : undefined;
    const take = pageSize || undefined;
    const where: any = {};
    if (customer_id !== null && customer_id !== undefined) {
      where.customer_id = customer_id;
    }
    if (search && search.trim() !== "") {
      where.name = ILike(`%${search}%`);
    }
    const [data, total] = await this.customerAddressRepository.findAndCount({
      where,
      order: { id: 'DESC' },
      relations: ['city', 'state', 'country' ],
      skip,
      take,
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
 
  }

  async findOne(id: number) {
    return this.customerAddressRepository.findOne({ 
      where: { id }, 
      relations: ['city', 'state', 'country' ]
     });
  }


  create(createCustomerAddressDto: CreateCustomerAddressDto) {
    const address = this.customerAddressRepository.create(createCustomerAddressDto);
    return this.customerAddressRepository.save(address);
  }

  findAll() {
    return this.customerAddressRepository.find();
  }



  update(id: number, updateCustomerAddressDto: UpdateCustomerAddressDto) {
    return this.customerAddressRepository.update(id, updateCustomerAddressDto);
  }

  remove(id: number) {
    return this.customerAddressRepository.delete(id);
  }
}
