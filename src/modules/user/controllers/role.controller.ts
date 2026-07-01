import {
  IRoleService,
  CreateRoleDto,
  UpdateRoleDto,
  RoleResponseDto,
} from '@modules/user/index.js';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/index.js';
import { Roles } from '@common/decorators/index.js';
import { UserRole } from '@common/enums/index.js';
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

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class RoleController {
  constructor(private readonly roleService: IRoleService) {}

  @Get()
  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleService.findAll();
    return roles.map((r) => new RoleResponseDto(r));
  }

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RoleResponseDto> {
    const role = await this.roleService.findById(id);
    return new RoleResponseDto(role);
  }

  @Post()
  async create(@Body() dto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = await this.roleService.create(dto);
    return new RoleResponseDto(role);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const role = await this.roleService.update(id, dto);
    return new RoleResponseDto(role);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.roleService.delete(id);
  }
}
