import {
  IUserService,
  CreateUserDto,
  UpdateUserDto,
  UpdateProfileDto,
  UserResponseDto,
} from '@modules/user/index.js';
import { JwtAuthGuard, RolesGuard, CurrentUser } from '@modules/auth/index.js';
import { Roles } from '@common/decorators/index.js';
import { UserRole } from '@common/enums/index.js';
import type { JwtPayload } from '@modules/auth/strategies/jwt.strategy.js';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @Get('me')
  async getProfile(
    @CurrentUser() userPayload: JwtPayload,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findById(userPayload.sub);
    return new UserResponseDto(user);
  }

  @Put('me')
  async updateProfile(
    @CurrentUser() userPayload: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.updateProfile(userPayload.sub, dto);
    return new UserResponseDto(user);
  }

  @Get('me/favorites')
  async getFavorites(@CurrentUser() userPayload: JwtPayload) {
    // In a real app we might map this to PlaceResponseDto, but for now we return the raw entities
    return this.userService.getFavorites(userPayload.sub);
  }

  @Post('me/favorites/:placeId')
  async toggleFavorite(
    @CurrentUser() userPayload: JwtPayload,
    @Param('placeId', ParseUUIDPipe) placeId: string,
  ) {
    return this.userService.toggleFavorite(userPayload.sub, placeId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    return users.map((u) => new UserResponseDto(u));
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findById(id);
    return new UserResponseDto(user);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(dto);
    return new UserResponseDto(user);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.update(id, dto);
    return new UserResponseDto(user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
