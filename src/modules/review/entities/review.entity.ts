import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@common/entities/base.entity.js';
import { User } from '@modules/user/entities/user.entity.js';
import { Place } from '@modules/place/entities/place.entity.js';
export class ReviewImage {
  id: string;
  fileName: string;
  mimeType: string;
  url: string;
}

@Entity('reviews')
export class Review extends AbstractEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Place)
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column({ name: 'place_id' })
  placeId: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'jsonb', default: [] })
  images: ReviewImage[];
}
