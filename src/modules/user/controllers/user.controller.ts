import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { IUserService } from '../interfaces/user-service.interface.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.delete(id);
  }
}
