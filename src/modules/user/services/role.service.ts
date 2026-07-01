import {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  IRoleService,
  IRoleRepository,
  User,
} from '@modules/user/index.js';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    private readonly roleRepository: IRoleRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async findById(id: string): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with id "${id}" not found`);
    }
    return role;
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepository.findByKey(dto.key.toUpperCase());
    if (existing) {
      throw new ConflictException(`Role with key "${dto.key}" already exists`);
    }
    return this.roleRepository.create({
      name: dto.name,
      key: dto.key.toUpperCase(),
    });
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findById(id);

    if (dto.key && dto.key.toUpperCase() !== role.key) {
      const existing = await this.roleRepository.findByKey(
        dto.key.toUpperCase(),
      );
      if (existing) {
        throw new ConflictException(
          `Role with key "${dto.key}" already exists`,
        );
      }
    }

    return this.roleRepository.update(id, {
      ...dto,
      ...(dto.key && { key: dto.key.toUpperCase() }),
    });
  }

  async delete(id: string): Promise<void> {
    const role = await this.findById(id);

    // Check if any users are using this role
    const usersCount = await this.dataSource.manager.count(User, {
      where: { role: { id } },
    });

    if (usersCount > 0) {
      throw new BadRequestException(
        `Cannot delete role "${role.name}" because it is assigned to ${usersCount} users.`,
      );
    }

    await this.roleRepository.softDelete(id);
  }
}
