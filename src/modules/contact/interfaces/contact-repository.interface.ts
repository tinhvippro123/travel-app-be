import { Contact } from '../entities/contact.entity.js';
import { IBaseRepository } from '@common/interfaces/base-repository.interface.js';

export abstract class IContactRepository extends IBaseRepository<Contact> {
  abstract getGlobalContact(): Promise<Contact | null>;
}
