import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity.js';
import { PlaceController } from './controllers/place.controller.js';
import { PlaceRepository } from './repositories/place.repository.js';
import { PlaceService } from './services/place.service.js';
import { IPlaceRepository } from './interfaces/place-repository.interface.js';
import { IPlaceService } from './interfaces/place-service.interface.js';

@Module({
  imports: [TypeOrmModule.forFeature([Place])],
  controllers: [PlaceController],
  providers: [
    { provide: IPlaceRepository, useClass: PlaceRepository },
    { provide: IPlaceService, useClass: PlaceService },
  ],
  exports: [IPlaceService],
})
export class PlaceModule {}
