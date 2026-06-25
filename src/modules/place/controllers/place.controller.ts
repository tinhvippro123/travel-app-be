import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { IPlaceService } from '../interfaces/place-service.interface.js';
import { CreatePlaceDto } from '../dto/create-place.dto.js';
import { UpdatePlaceDto } from '../dto/update-place.dto.js';
import { PlaceStatus } from '@common/enums/index.js';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: IPlaceService) {}

  @Get()
  findAll() {
    return this.placeService.findAll();
  }

  @Get('search')
  searchByDestination(@Query('destination') destination: string) {
    return this.placeService.findByDestination(destination);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: PlaceStatus) {
    return this.placeService.findByStatus(status);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.placeService.findById(id);
  }

  @Post()
  create(@Body() dto: CreatePlaceDto) {
    return this.placeService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePlaceDto) {
    return this.placeService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.placeService.delete(id);
  }
}
