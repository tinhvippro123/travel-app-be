import { Contact } from '../entities/contact.entity';
import { IBaseRepository } from '@common/interfaces/base-repository.interface';

export abstract class IContactRepository extends IBaseRepository<Contact> {
  abstract getGlobalContact(): Promise<Contact | null>;
}
