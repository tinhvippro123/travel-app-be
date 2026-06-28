import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from '../services/auth.service.js';
import { LoginDto } from '../dto/login.dto.js';
import { RegisterDto } from '../dto/register.dto.js';
import { Public } from '@common/decorators/index.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: { id: string } }) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() request: ExpressRequest) {
    const token = request.headers.authorization?.replace('Bearer ', '').trim();
    if (token) {
      await this.authService.logout(token);
    }
    return { success: true, message: 'Logged out successfully' };
  }
}
