import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Contact,
  ContactController,
  ContactRepository,
  ContactService,
  IContactRepository,
  IContactService,
} from './index.js';

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
