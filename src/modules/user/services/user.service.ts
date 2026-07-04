import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUserService } from '../interfaces/user-service.interface';
import { IUserRepository } from '../interfaces/user-repository.interface';

/**
 * Concrete implementation của IUserService.
 * Inject IUserRepository (abstract class) → NestJS DI tự resolve đến UserRepository.
 */
@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

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
    // Check email tồn tại chưa
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(`Email "${dto.email}" already exists`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findById(id); // Throw nếu không tìm thấy
    return this.userRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Throw nếu không tìm thấy
    await this.userRepository.softDelete(id);
  }
}
