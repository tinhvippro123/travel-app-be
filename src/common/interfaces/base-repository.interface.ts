import { DeepPartial, FindOptionsWhere } from 'typeorm';

/**
 * Abstract class cho Repository — dùng làm DI token.
 * TypeScript interface bị xóa ở runtime, nên dùng abstract class
 * để NestJS DI có thể resolve được.
 *
 * Mỗi feature module sẽ tạo interface extends class này
 * và thêm các method riêng cho domain đó.
 */
export abstract class IBaseRepository<T> {
  abstract findAll(): Promise<T[]>;

  abstract findById(id: string): Promise<T | null>;

  abstract findOneBy(where: FindOptionsWhere<T>): Promise<T | null>;

  abstract create(data: DeepPartial<T>): Promise<T>;

  abstract update(id: string, data: DeepPartial<T>): Promise<T>;

  abstract softDelete(id: string): Promise<void>;

  abstract hardDelete(id: string): Promise<void>;
}
