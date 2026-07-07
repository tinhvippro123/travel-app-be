import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { IContactService } from '../interfaces/contact-service.interface.js';
import { UpdateContactDto } from '../dto/update-contact.dto.js';
import { ContactResponseDto } from '../dto/contact-response.dto.js';
import { JwtAuthGuard, RolesGuard } from '@modules/auth';
import { Roles } from '@common/decorators/index.js';
import { UserRole } from '@common/enums/index.js';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: IContactService) {}

  @Get()
  async getGlobalContact(): Promise<ContactResponseDto> {
    const contact = await this.contactService.getGlobalContact();
    return new ContactResponseDto(contact);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateGlobalContact(
    @Body() dto: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    const contact = await this.contactService.updateGlobalContact(dto);
    return new ContactResponseDto(contact);
  }
}
