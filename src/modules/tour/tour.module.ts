import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from './entities/tour.entity.js';
import { TourController } from './controllers/tour.controller.js';
import { TourRepository } from './repositories/tour.repository.js';
import { TourService } from './services/tour.service.js';
import { ITourRepository } from './interfaces/tour-repository.interface.js';
import { ITourService } from './interfaces/tour-service.interface.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tour])],
  controllers: [TourController],
  providers: [
    { provide: ITourRepository, useClass: TourRepository },
    { provide: ITourService, useClass: TourService },
  ],
  exports: [ITourService],
})
export class TourModule {}
