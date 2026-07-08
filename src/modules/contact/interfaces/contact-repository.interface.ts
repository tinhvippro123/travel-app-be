import { Contact } from '../entities/contact.entity.js';
import { IBaseRepository } from '@common/interfaces';

export abstract class IContactRepository extends IBaseRepository<Contact> {
  abstract getGlobalContact(): Promise<Contact | null>;
}
