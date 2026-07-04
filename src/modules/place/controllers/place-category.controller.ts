import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Put,
} from '@nestjs/common';
import { IPlaceCategoryService } from '@modules/place/interfaces';
import {
  CreatePlaceCategoryDto,
  UpdatePlaceCategoryDto,
} from '@modules/place/dto';
import { PaginationDto } from '@common/dto';

@Controller('place-categories')
export class PlaceCategoryController {
  constructor(private readonly categoryService: IPlaceCategoryService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.categoryService.findPaginated(pagination);
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
