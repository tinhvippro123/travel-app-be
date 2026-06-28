import { Place } from '@modules/place/entities/index.js';
import { PlaceController } from '@modules/place/controllers/index.js';
import { PlaceRepository } from '@modules/place/repositories/index.js';
import { PlaceService } from '@modules/place/services/index.js';
import {
  IPlaceRepository,
  IPlaceService,
} from '@modules/place/interfaces/index.js';
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
