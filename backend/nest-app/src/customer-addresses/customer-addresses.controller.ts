import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerAddressesService } from './customer-addresses.service';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';

@Controller('customer-addresses')
export class CustomerAddressesController {
  constructor(private readonly customerAddressesService: CustomerAddressesService) {}

  @Post()
  create(@Body() createCustomerAddressDto: CreateCustomerAddressDto) {
    return this.customerAddressesService.create(createCustomerAddressDto);
  }

  @Post('get-customer-address-list')
  getCustomerAddressList(@Body() body:{customer_id?:number,page?:number,pageSize?:number,search?:string}) {
    return this.customerAddressesService.getCustomerAddressList(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerAddressesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerAddressDto: UpdateCustomerAddressDto) {
    return this.customerAddressesService.update(+id, updateCustomerAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerAddressesService.remove(+id);
  }
}
