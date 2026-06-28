import { IUserService } from '@modules/user/interfaces/index.js';
import { CreateUserDto, UpdateUserDto } from '@modules/user/dto/index.js';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
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
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
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
