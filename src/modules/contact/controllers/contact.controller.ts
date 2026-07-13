import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { IContactService } from '../interfaces/contact-service.interface';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { ContactResponseDto } from '../dto/contact-response.dto';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/index';
import { Roles } from '@common/decorators/index';
import { UserRole } from '@common/enums/index';

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
