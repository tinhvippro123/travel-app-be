import { User } from '@modules/user/index';
import { IBaseRepository } from '@common/interfaces/base-repository.interface';
/** * Interface cho User Repository. * Extends IBaseRepository (CRUD chung) và thêm method riêng cho User domain. */ import { Place } from '@modules/place/entities/place.entity';

export abstract class IUserRepository extends IBaseRepository<User> {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract addFavorite(userId: string, placeId: string): Promise<void>;
  abstract removeFavorite(userId: string, placeId: string): Promise<void>;
  abstract getFavorites(userId: string): Promise<Place[]>;
}
