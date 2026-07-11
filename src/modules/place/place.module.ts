import { Place, IPlaceRepository, IPlaceService } from '@modules/place';
import { PlaceController } from '@modules/place/controllers';
import { PlaceRepository } from '@modules/place/repositories';
import { PlaceService } from '@modules/place/services';
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
