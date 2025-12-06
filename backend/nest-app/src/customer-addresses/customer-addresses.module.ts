import { Module } from '@nestjs/common';
import { CustomerAddressesService } from './customer-addresses.service';
import { CustomerAddressesController } from './customer-addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAddress } from './entities/customer-address.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CustomerAddress])],
  controllers: [CustomerAddressesController],
  providers: [CustomerAddressesService],
  exports:[CustomerAddressesService]
})

export class CustomerAddressesModule {}
