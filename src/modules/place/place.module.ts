import {
  Place,
  IPlaceRepository,
  IPlaceService,
} from '@modules/place';
import { PlaceController } from './controllers/place.controller.js';
import { PlaceRepository } from './repositories/place.repository.js';
import { PlaceService } from './services/place.service.js';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
