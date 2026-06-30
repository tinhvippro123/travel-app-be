import { AuthService } from '../services/auth.service.js';
import { LoginDto, RegisterDto, AuthResponseDto } from '@modules/auth/index.js';
import { JwtAuthGuard } from '@modules/auth/index.js';
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
import { Public } from '@common/decorators/index.js';
import { UserResponseDto } from '@modules/user/index.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(dto);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(
    @Request() req: { user: { id: string } },
  ): Promise<UserResponseDto> {
    const user = await this.authService.getProfile(req.user.id);
    return new UserResponseDto(user);
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
