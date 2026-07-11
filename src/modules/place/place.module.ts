import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place, PlaceCategory } from '@modules/place/entities';
import {
  PlaceCategoryController,
  PlaceController,
} from '@modules/place/controllers';
import {
  PlaceCategoryRepository,
  PlaceRepository,
} from '@modules/place/repositories';
import { PlaceCategoryService, PlaceService } from '@modules/place/services';
import {
  IPlaceCategoryRepository,
  IPlaceCategoryService,
  IPlaceRepository,
  IPlaceService,
} from '@modules/place/interfaces';

@Module({
  imports: [TypeOrmModule.forFeature([Place, PlaceCategory])],
  controllers: [PlaceCategoryController, PlaceController],
  providers: [
    { provide: IPlaceCategoryRepository, useClass: PlaceCategoryRepository },
    { provide: IPlaceCategoryService, useClass: PlaceCategoryService },
    { provide: IPlaceRepository, useClass: PlaceRepository },
    { provide: IPlaceService, useClass: PlaceService },
  ],
  exports: [IPlaceCategoryService, IPlaceService],
})
export class PlaceModule {}
