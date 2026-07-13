import { Role, IRoleRepository } from '@modules/user/index';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepo.find();
  }

  async findById(id: string): Promise<Role | null> {
    return this.roleRepo.findOne({ where: { id } });
  }

  async findOneBy(where: FindOptionsWhere<Role>): Promise<Role | null> {
    return this.roleRepo.findOne({ where });
  }

  async findByKey(key: string): Promise<Role | null> {
    return this.roleRepo.findOne({ where: { key } });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepo.findOne({ where: { name } });
  }

  async create(data: DeepPartial<Role>): Promise<Role> {
    const role = this.roleRepo.create(data);
    return this.roleRepo.save(role);
  }

  async update(id: string, data: DeepPartial<Role>): Promise<Role> {
    await this.roleRepo.update(id, data);
    return this.findById(id) as Promise<Role>;
  }

  async softDelete(id: string): Promise<void> {
    await this.roleRepo.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.roleRepo.delete(id);
  }
}
