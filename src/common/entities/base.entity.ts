import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

/**
 * AbstractEntity chứa các field chung cho tất cả entity:
 * - id (UUID auto-generate)
 * - createdAt, updatedAt (auto timestamp)
 * - deletedAt (soft delete)
 *
 * Đặt tên AbstractEntity thay vì BaseEntity để tránh conflict
 * với TypeORM's BaseEntity.
 */
export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
