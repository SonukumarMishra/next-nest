import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeFileService } from './employee-file-service';
import { uploadEmployeeImage } from './decorator/upload-employee-image-decorator';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService,

    private readonly employeeFileService: EmployeeFileService
  ) { }



  @Post()
  @uploadEmployeeImage('image')
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const employee = await this.employeeService.create(createEmployeeDto);




    if (!file) {
      console.log('⚠️ No file received');
    } else {
      console.log('3️⃣ File received:', file.originalname);
    }
    await this.employeeFileService.handleEmployeeFile(
      employee.id,
      file!,
    );
    return {
      status: true,
      message: 'Data added successfully',
    };
  }

  @Patch('change-status')
  changeStatus(@Body() body: { id: number, status: number }) {
    const { id, status } = body;
    return this.employeeService.changeStatus(id, status);
  }



  @Patch('remove-image')
  async removeImage(@Body() body: { id: number }) {
    const { id } = body;
    const employee = await this.employeeService.findOne(+id);
    if (employee.image) {
      await this.employeeFileService.removeEmployeeFile(employee.id);
    }
    return {
      status: true,
      message: 'Eimployee image removed successfully',
      category: employee,
    };
  }




  // @Get()
  // findAll() {
  //   return this.employeeService.findAll();
  // }

@Post('list')
findAll(@Body() dto: { page: number; pageSize: number; search?: string,countryId?: number,stateId?:number,cityId?:number,roleId?:number }) {
  return this.employeeService.findAll(dto);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }
 

  @Patch(':id')
  @uploadEmployeeImage('image')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updatedEmployee = await this.employeeService.update(+id, updateEmployeeDto);
    if (!updatedEmployee) {
      return {
        status: false,
        message: 'Something went wrong!',
      };
    }

    if (file) {
      console.log('🖼️ Updating category image:', file.originalname);
      await this.employeeFileService.handleEmployeeFile(updatedEmployee.id, file);
    } else {
      console.log('⚠️ No new image provided');
    }

    return {
      status: true,
      message: 'Category updated successfully',
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
