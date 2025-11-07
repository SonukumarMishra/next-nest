import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from "crypto";
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private emoloyeeRepository: Repository<Employee>,
  ) { }
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const emailExistance = await this.emoloyeeRepository.findOneBy({ email: createEmployeeDto.email });
    if (emailExistance) {
      throw new ConflictException("Email Address already Exists!");
    }

    const phoneExistance = await this.emoloyeeRepository.findOneBy({ phone: createEmployeeDto.phone });
    if (phoneExistance) {
      throw new ConflictException("Phone already Exists!");
    }
    const password = await bcrypt.hash(createEmployeeDto.password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const registrationDay = new Date().toLocaleDateString('en', { weekday: 'long' });
    const customer = this.emoloyeeRepository.create({
      ...createEmployeeDto,
      otp,
      otpExpiry,
      registrationDay,
      password
    });

    return this.emoloyeeRepository.save(customer);
  }


  async findEmployee(key: string, value: string): Promise<Employee> {
    let employee: Employee | null = null;
    if (key === 'email' || key === 'phone') {
      employee = await this.emoloyeeRepository.findOneBy({ [key]: value });
    } else if (key === 'id') {
      employee = await this.emoloyeeRepository.findOneBy({ id: Number(value) });
    } else {
      throw new NotFoundException("Invalid Input");
    }
    if (!employee) {
      throw new NotFoundException("Employee not found");
    }
    return employee;
  }

  async resendOtp(contact: string, type: 'email' | 'phone'): Promise<any> {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const otpLastSentAt = new Date();
    const updateCondition = type === 'email' ? { email: contact } : { phone: contact };
    const result = await this.emoloyeeRepository.update(updateCondition, { otp, otpExpiry, otpLastSentAt });
    if (result.affected && result.affected > 0) {
      return {
        message: "OTP sent successfully to " + type,
        otp,
      }
    } else {
      throw new BadRequestException('No ' + type + " record found or update failed");
    }
  }

  async updateEmployee(id: number, data: Record<string, any>) {
    await this.emoloyeeRepository.update({ id }, data);
    return this.emoloyeeRepository.findOneBy({ id });
  }

  async updateLoginCounter(employee:Employee){
     await this.emoloyeeRepository.increment(
    { id: employee.id }, 
    'totalLogin', 
    1    
  );
      
  }



  findAll() {
    return this.emoloyeeRepository.find({
      relations: ['role'],
    });
  }

  async findOne(id: number) {
    const emp = await this.emoloyeeRepository.findOne({ where: { id }, relations: ['role'] });
    if (!emp) throw new NotFoundException('Employee not found');
    return emp;
  }



  async update(id: number, data: Partial<Employee>) {
    const emp = await this.findOne(id);
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await this.emoloyeeRepository.update(id, data);
    return this.emoloyeeRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.emoloyeeRepository.delete(id);
  }
}
