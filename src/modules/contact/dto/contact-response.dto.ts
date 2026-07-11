import { Expose } from 'class-transformer';
import { Contact } from '../entities/contact.entity';

export class ContactResponseDto {
  @Expose()
  id: string;

  @Expose()
  companyName: string | null;

  @Expose()
  address: string | null;

  @Expose()
  phone: string | null;

  @Expose()
  email: string | null;

  @Expose()
  facebook: string | null;

  @Expose()
  zalo: string | null;

  @Expose()
  instagram: string | null;

  constructor(contact: Contact) {
    this.id = contact.id;
    this.companyName = contact.companyName;
    this.address = contact.address;
    this.phone = contact.phone;
    this.email = contact.email;
    this.facebook = contact.facebook;
    this.zalo = contact.zalo;
    this.instagram = contact.instagram;
  }
}
