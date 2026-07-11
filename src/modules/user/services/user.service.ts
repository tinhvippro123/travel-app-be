import {
  User,
  LocalAccount,
  Role,
  CreateUserDto,
  UpdateUserDto,
  UpdateProfileDto,
  IUserService,
  IUserRepository,
} from '@modules/user/index';
import { Place } from '@modules/place/entities/place.entity';
import { RegisterDto } from '@modules/auth/index';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return user;
  }
  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(`Email "${dto.email}" already exists`);
    }

    let role: Role | null = null;
    if (dto.role) {
      role = await this.dataSource.manager.findOne(Role, {
        where: { key: dto.role.toUpperCase() },
      });
      if (!role) {
        throw new NotFoundException(`Role "${dto.role}" not found in database`);
      }
    }

    return this.userRepository.create({
      email: dto.email,
      fullName: dto.fullName,
      ...(role && { role }),
    });
  }
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findById(id);
    return this.userRepository.update(id, dto);
  }
  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepository.softDelete(id);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    await this.findById(id);
    return this.userRepository.update(id, dto);
  }

  async registerNewUser(dto: RegisterDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingAccount = await queryRunner.manager.findOne(LocalAccount, {
        where: { email: dto.email },
      });
      if (existingAccount) {
        throw new ConflictException('Email này đã được sử dụng');
      }
      let role = await queryRunner.manager.findOne(Role, {
        where: { key: 'USER' },
      });
      if (!role) {
        role = queryRunner.manager.create(Role, {
          name: 'Khách hàng',
          key: 'USER',
        });
        await queryRunner.manager.save(role);
      }
      const user = queryRunner.manager.create(User, {
        email: dto.email,
        fullName: dto.fullName,
        role: role,
        status: 'ACTIVE',
      });
      const savedUser = await queryRunner.manager.save(user);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);
      const localAccount = queryRunner.manager.create(LocalAccount, {
        userId: savedUser.id,
        email: dto.email,
        passwordHash: hashedPassword,
      });
      await queryRunner.manager.save(localAccount);
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async toggleFavorite(
    userId: string,
    placeId: string,
  ): Promise<{ isFavorite: boolean }> {
    await this.findById(userId); // Ensure user exists
    const favorites = await this.userRepository.getFavorites(userId);
    const isCurrentlyFavorite = favorites.some((place) => place.id === placeId);

    if (isCurrentlyFavorite) {
      await this.userRepository.removeFavorite(userId, placeId);
      return { isFavorite: false };
    } else {
      await this.userRepository.addFavorite(userId, placeId);
      return { isFavorite: true };
    }
  }

  async getFavorites(userId: string): Promise<Place[]> {
    await this.findById(userId); // Ensure user exists
    return this.userRepository.getFavorites(userId);
  }
}
