import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerFileService } from './customer-file-service';

@Module({
  imports:[TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [CustomerService,CustomerFileService],
  exports:[CustomerService,CustomerFileService]
})
export class CustomerModule {}
