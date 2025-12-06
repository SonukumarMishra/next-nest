import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { ILike, Repository } from 'typeorm';
import { promises } from 'dns';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';


@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private readonly customerRepository: Repository<Customer>) { }
  async createCustomer(createCustomerDto:CreateCustomerDto){
    const emailExistance=await this.customerRepository.findOneBy({email:createCustomerDto.email});
    if(emailExistance){
      throw new ConflictException("Email Address Already exists!");
    }
    const phoneExistance=await this.customerRepository.findOneBy({email:createCustomerDto.phone});
    if(phoneExistance){
      throw new ConflictException("Phone number Already exists");
    }
    const password=await bcrypt.hash(createCustomerDto.password,10);
    const otp=crypto.randomInt(100000,999999).toString();
    const otpExpiry=new Date(Date.now() + 10*60*60);
    const registrationDay=new Date().toLocaleDateString('en',{weekday:'long'});
    const customer=this.customerRepository.create({
      ...createCustomerDto,
      otp,
      password,
      otpExpiry,
      registrationDay,
      role:{id:createCustomerDto.role_id}
    });
    return this.customerRepository.save(customer);
  }

 

  async findAll(dto: { page: number; pageSize: number; search?: string; roleId?: number }) {
    const { page, pageSize, search, roleId } = dto;
    const skip = (page - 1) * pageSize;
    const where: any = {};
    if (search && search.trim() !== "") {
      where.name = ILike(`%${search}%`);
    }

    if (roleId) {
      where.role = { id: roleId };
    }
    const [data, total] = await this.customerRepository.findAndCount({
      where,
      relations: ['role'],
      order: { id: "DESC" },
      skip,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async changeStatus(id: number, status: number) {
    const customer = await this.findOne(id);
    if (!customer) {
      return this.setMessage(false, "Customer Not Found", 404);
    }
    try {
      customer.status = status;
      await this.customerRepository.save(customer);
      return this.setMessage(true, "Status updated successfully", 200);
    } catch (error) {
      return this.setMessage(false, "Failed to update", 400);
    }
  }

  async setMessage(status: boolean, message: string, code: number) {
    return { status, message, code };
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }
    return customer;
  }


  async updateCustomer(id: number, data: Partial<Customer>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await this.customerRepository.update(id, data);
    return this.findOne(id);
  }


  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
