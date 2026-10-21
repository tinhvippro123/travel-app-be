import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service.js';
import { LoginDto, RegisterDto } from '../dto/auth.dto.js';
import { Public } from '../decorators/public.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
