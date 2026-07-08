import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Contact,
  IContactRepository,
  IContactService,
} from './index.js';
import { ContactController } from '@modules/contact/controllers';
import { ContactRepository } from '@modules/contact/repositories';
import { ContactService } from '@modules/contact/services';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [ContactController],
  providers: [
    { provide: IContactRepository, useClass: ContactRepository },
    { provide: IContactService, useClass: ContactService },
  ],
  exports: [IContactService],
})
export class ContactModule {}
