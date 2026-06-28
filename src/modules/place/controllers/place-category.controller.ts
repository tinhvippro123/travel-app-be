import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { IPlaceCategoryService } from '@modules/place/interfaces';
import {
  CreatePlaceCategoryDto,
  UpdatePlaceCategoryDto,
} from '@modules/place/dto';

@Controller('place-categories')
export class PlaceCategoryController {
  constructor(private readonly categoryService: IPlaceCategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findById(id);
  }

  @Post()
  create(@Body() dto: CreatePlaceCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePlaceCategoryDto,
  ) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.delete(id);
  }
}
