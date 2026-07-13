import { Contact } from '../entities/contact.entity';
import { UpdateContactDto } from '../dto/update-contact.dto';

export abstract class IContactService {
  abstract getGlobalContact(): Promise<Contact>;
  abstract updateGlobalContact(dto: UpdateContactDto): Promise<Contact>;
}
