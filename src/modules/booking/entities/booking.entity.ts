import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@common/entities/base.entity.js';
import { BookingStatus } from '@common/enums/index.js';
import { User } from '@modules/user/entities/user.entity.js';
import { Tour } from '@modules/tour/entities/tour.entity.js';

@Entity('bookings')
export class Booking extends AbstractEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Tour)
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;

  @Column({ name: 'tour_id' })
  tourId: string;

  @Column({ name: 'number_of_participants' })
  numberOfParticipants: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ nullable: true })
  note?: string;

  @Column({ name: 'contact_phone' })
  contactPhone: string;

  @Column({ name: 'contact_email' })
  contactEmail: string;
}
