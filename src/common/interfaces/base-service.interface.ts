/**
 * Abstract class cho Service — dùng làm DI token.
 * Mỗi feature module sẽ tạo interface extends class này
 * và thêm các method riêng cho domain đó.
 *
 * Generic types:
 * - T: Entity type
 * - CreateDto: DTO để tạo mới
 * - UpdateDto: DTO để cập nhật
 */
export abstract class IBaseService<T, CreateDto, UpdateDto> {
  abstract findAll(): Promise<T[]>;

  abstract findById(id: string): Promise<T>;

  abstract create(dto: CreateDto): Promise<T>;

  abstract update(id: string, dto: UpdateDto): Promise<T>;

  abstract delete(id: string): Promise<void>;
}
