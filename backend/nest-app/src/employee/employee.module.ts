import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee } from './entities/employee.entity';
import { EmployeeFileService } from './employee-file-service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeeService,EmployeeFileService],
  controllers: [EmployeeController],
  exports:[EmployeeService,EmployeeFileService]
})
export class EmployeeModule {}
