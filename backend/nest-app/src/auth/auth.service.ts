import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { EmployeeService } from 'src/employee/employee.service';
@Injectable()
export class AuthService {
  constructor(private readonly employeeService: EmployeeService,
    private readonly JwtService: JwtService
  ) { }

  async login(email: string, password: string) {
    const employee = await this.validateEmployee(email, password);
    const payload = { sub: employee.id, email: employee.email };
    const token = this.JwtService.sign(payload);
    return {
      status: 1,
      message: 'Login successfully',
      data: {
        token,
        employee,
      },
    };


  }


  async validateEmployee(email: string, password: string) {
    const employee = await this.employeeService.findEmployee('email', email);
    if (!employee) {
      throw new UnauthorizedException("Invalid Cred");
    }
    const checkPassword = await bcrypt.compare(password, employee.password);
    if (!checkPassword) {
      throw new UnauthorizedException("Invalid Cred");
    }
    if (!employee.emailVerification) {
      throw new UnauthorizedException("Your account needs email varification");
    }
    if (!employee.phoneVerification) {
      throw new UnauthorizedException("Your account needs phone varification");
    }
    if (!employee.status) {
      throw new UnauthorizedException("Your account needs admin varification");
    }
    await this.employeeService.updateLoginCounter(employee);
    return employee;
  }

  async emailVerification(email: string, otp: string) {
    const customer = await this.employeeService.findEmployee('email', email);
    if (!customer) {
      throw new UnauthorizedException("Customer not found!");
    }
    if (customer.emailVerification) {
      throw new UnauthorizedException("Email Verification already completed!");
    }
    if (customer.otp != otp) {
      throw new UnauthorizedException("OTP did not matches!");
    }
    const expiryTime = new Date(customer.otpExpiry).getTime();
    if (expiryTime <= Date.now()) {
      throw new BadRequestException("OTP expired!");
    }
    //return this.employeeService.emailVerification(email);
  }

  async resendOtpEmail(email: string) {
    const customer = await this.employeeService.findEmployee('email', email);
    if (!customer) {
      throw new UnauthorizedException("Customer not found!");
    }
    if (customer.emailVerification) {
      throw new UnauthorizedException("Email Verification already completed!");
    }
    if (customer.otpLastSentAt) {
      const now = new Date();
      const lastSent = new Date(customer.otpLastSentAt);
      const diffSeconds = (now.getTime() - lastSent.getTime()) / 1000;

      if (diffSeconds < 30) {
        throw new BadRequestException(
          `Please wait ${30 - Math.floor(diffSeconds)} seconds before requesting another OTP`
        );
      }
    }
    //return this.employeeService.resendOtpEmail(email);
  }



}
