import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }

  @Post('email-verification')
  emailVerification(@Body('email') email: string, @Body('otp') otp: string) {
    return this.authService.emailVerification(email, otp);
  }

  @Post('resend-otp-email')
  resendOtpEmail(@Body('email') email: string) {
    return this.authService.resendOtpEmail(email);
  }
}
