import { Entity, Column, ManyToMany } from 'typeorm';
import { AbstractEntity } from '@common/entities/base.entity';
import { Place } from '@modules/place/entities/place.entity';

@Entity('place_categories')
export class PlaceCategory extends AbstractEntity {
  @Column()
  name: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => Place, (place) => place.categories)
  places?: Place[];
}
