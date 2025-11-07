import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmployeeModule } from 'src/employee/employee.module';
 
@Module({
  imports: [JwtModule.register({
    secret: "1234567890",
    signOptions: { expiresIn: "1h" }
  }),
    EmployeeModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
