import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { IPlaceService } from '@modules/place/interfaces';
import {
  CreatePlaceDto,
  PlaceQueryDto,
  UpdatePlaceDto,
  UpdatePlaceStatusDto,
} from '@modules/place/dto';
import { PlaceStatus } from '@common/enums';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: IPlaceService) {}

  @Get()
  findAll(@Query() query: PlaceQueryDto) {
    return this.placeService.findPaginated(query);
  }

  @Get('search')
  searchByLocation(@Query('location') location: string) {
    return this.placeService.findByLocation(location);
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

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePlaceStatusDto,
  ) {
    return this.placeService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.placeService.delete(id);
  }
}
