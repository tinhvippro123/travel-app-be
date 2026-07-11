import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';

export enum PlaceSortOption {
  DEFAULT = 'default',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  UPDATED_NEWEST = 'updated_newest',
}

export class PlaceQueryDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value as string[] | undefined;
    return value
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  })
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsEnum(PlaceSortOption)
  sort?: PlaceSortOption = PlaceSortOption.DEFAULT;
}
