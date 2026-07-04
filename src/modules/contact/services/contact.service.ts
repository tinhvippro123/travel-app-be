import { Contact } from '../entities/contact.entity.js';
import { IContactRepository } from '../interfaces/contact-repository.interface.js';
import { IContactService } from '../interfaces/contact-service.interface.js';
import { UpdateContactDto } from '../dto/update-contact.dto.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactService implements IContactService {
  constructor(private readonly contactRepository: IContactRepository) {}

  async getGlobalContact(): Promise<Contact> {
    let contact = await this.contactRepository.getGlobalContact();
    if (!contact) {
      // Auto-create a default empty record if it doesn't exist
      contact = await this.contactRepository.create({
        companyName: 'Default Company',
      });
    }
    return contact;
  }

  async updateGlobalContact(dto: UpdateContactDto): Promise<Contact> {
    let contact = await this.contactRepository.getGlobalContact();
    if (!contact) {
      contact = await this.contactRepository.create({
        companyName: 'Default Company',
      });
    }
    return this.contactRepository.update(contact.id, dto);
  }
}
