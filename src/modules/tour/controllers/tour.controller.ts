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
import { ITourService } from '../interfaces/tour-service.interface.js';
import { CreateTourDto } from '../dto/create-tour.dto.js';
import { UpdateTourDto } from '../dto/update-tour.dto.js';
import { TourStatus } from '../../../common/enums/index.js';

@Controller('tours')
export class TourController {
  constructor(private readonly tourService: ITourService) {}

  @Get()
  findAll() {
    return this.tourService.findAll();
  }

  @Get('search')
  searchByDestination(@Query('destination') destination: string) {
    return this.tourService.findByDestination(destination);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: TourStatus) {
    return this.tourService.findByStatus(status);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.tourService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateTourDto) {
    return this.tourService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTourDto) {
    return this.tourService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.tourService.delete(id);
  }
}
