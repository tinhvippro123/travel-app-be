import { Contact } from '../entities/contact.entity.js';
import { IContactRepository } from '../interfaces/contact-repository.interface.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';

@Injectable()
export class ContactRepository implements IContactRepository {
  constructor(
    @InjectRepository(Contact)
    private readonly repo: Repository<Contact>,
  ) {}

  async getGlobalContact(): Promise<Contact | null> {
    // Only one row should exist, so we fetch the first one
    return this.repo.findOne({ where: {} });
  }

  async findAll(): Promise<Contact[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<Contact | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findOneBy(where: FindOptionsWhere<Contact>): Promise<Contact | null> {
    return this.repo.findOne({ where });
  }

  async create(data: DeepPartial<Contact>): Promise<Contact> {
    const contact = this.repo.create(data);
    return this.repo.save(contact);
  }

  async update(id: string, data: DeepPartial<Contact>): Promise<Contact> {
    await this.repo.update(id, data);
    return this.findById(id) as Promise<Contact>;
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
