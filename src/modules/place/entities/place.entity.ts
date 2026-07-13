import { Entity, Column, JoinTable, ManyToMany } from 'typeorm';
import { AbstractEntity } from '@common/entities/base.entity';
import { PlaceStatus } from '@common/enums';
import { PlaceCategory } from '@modules/place/entities/place-category.entity';
import { User } from '@modules/user/entities/user.entity';

@Entity('places')
export class Place extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'enum', enum: PlaceStatus, default: PlaceStatus.ACTIVE })
  status: PlaceStatus;

  @ManyToMany(() => PlaceCategory, (category) => category.places, {
    cascade: false,
  })
  @JoinTable({
    name: 'place_category_mappings',
    joinColumn: { name: 'place_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories?: PlaceCategory[];

  @ManyToMany(() => User, (user) => user.favoritePlaces)
  favoritedBy: User[];
}
