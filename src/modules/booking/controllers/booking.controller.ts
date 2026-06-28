import { IBookingService } from '@modules/booking/interfaces/index.js';
import {
  CreateBookingDto,
  UpdateBookingDto,
} from '@modules/booking/dto/index.js';
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
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: IBookingService) {}
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.findById(id);
  }
  // TODO: Lấy userId từ JWT token khi Auth module hoàn thiện
  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingService.update(id, dto);
  }
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.delete(id);
  }
}
