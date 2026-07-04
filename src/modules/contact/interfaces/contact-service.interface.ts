import { Contact } from '../entities/contact.entity.js';
import { UpdateContactDto } from '../dto/update-contact.dto.js';

export abstract class IContactService {
  abstract getGlobalContact(): Promise<Contact>;
  abstract updateGlobalContact(dto: UpdateContactDto): Promise<Contact>;
}
