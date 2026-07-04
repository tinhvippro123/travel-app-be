import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user-repository.interface';

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
    return this.userRepo.findOneBy({ id });
  }

  async findOneBy(where: FindOptionsWhere<User>): Promise<User | null> {
    return this.userRepo.findOne({ where });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOneBy({ email });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
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
}
