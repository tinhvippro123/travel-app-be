import { IsEnum } from 'class-validator';
import { PlaceStatus } from '@common/enums';

export class UpdatePlaceStatusDto {
  @IsEnum(PlaceStatus)
  status: PlaceStatus;
}
