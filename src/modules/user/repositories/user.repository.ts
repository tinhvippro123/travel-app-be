import { User, IUserRepository } from '@modules/user';
import { Place } from '@modules/place/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
/**
 * Concrete implementation của IUserRepository.
 * Sử dụng TypeORM Repository<User> để thao tác database.
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }
  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id }, relations: { role: true } });
  }
  async findOneBy(where: FindOptionsWhere<User>): Promise<User | null> {
    return this.userRepo.findOne({ where });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
      relations: { role: true },
    });
  }
  async create(data: DeepPartial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
  async update(id: string, data: DeepPartial<User>): Promise<User> {
    await this.userRepo.update(id, data);
    return this.findById(id) as Promise<User>;
  }
  async softDelete(id: string): Promise<void> {
    await this.userRepo.softDelete(id);
  }
  async hardDelete(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  async addFavorite(userId: string, placeId: string): Promise<void> {
    await this.userRepo
      .createQueryBuilder()
      .relation(User, 'favoritePlaces')
      .of(userId)
      .add(placeId);
  }

  async removeFavorite(userId: string, placeId: string): Promise<void> {
    await this.userRepo
      .createQueryBuilder()
      .relation(User, 'favoritePlaces')
      .of(userId)
      .remove(placeId);
  }

  async getFavorites(userId: string): Promise<Place[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { favoritePlaces: true },
    });
    return user?.favoritePlaces || [];
  }
}
