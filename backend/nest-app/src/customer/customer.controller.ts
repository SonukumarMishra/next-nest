import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { uploadCustomerImage } from './decorator/upload-customer-image-decorator';
import { CustomerFileService } from './customer-file-service';
import { stat } from 'fs';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService, private readonly customerFileService: CustomerFileService) { }

  @Post()
  @uploadCustomerImage('image')
  async create(@Body() createCustomerDto: CreateCustomerDto,@UploadedFile() file?:Express.Multer.File) {
    const customer=await this.customerService.createCustomer(createCustomerDto);
    await this.customerFileService.handleCustomerImage(customer.id,file!);
    return {
      status:true,
      message:"Data added"
    }
      
  }

  @Post('list')
  findAll(@Body() dto: { page: number; pageSize: number; search?: string, roleId?: number }) {
    return this.customerService.findAll(dto);
  }

  @Patch('change-status')
  changeStatus(@Body() body: { id: number, status: number }) {
    const { id, status } = body;
    return this.customerService.changeStatus(id, status);

  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }
 

  @Patch(':id')
  @uploadCustomerImage('image')
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto, @UploadedFile() file?: Express.Multer.File) {
    const updateCustomer = await this.customerService.updateCustomer(+id, updateCustomerDto);
    if (!updateCustomer) {
      return {
        status: false,
        message: "Something went wrong"
      };
    }
    if (file) {
      await this.customerFileService.handleCustomerImage(updateCustomer.id, file);
    }else{
      console.log("data not ab");
    }
    return {
      status: true,
      message: "customer updated successfully"
    }

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
