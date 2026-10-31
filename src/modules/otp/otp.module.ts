import { Module } from '@nestjs/common';
import { MailModule } from '../../infrastructure/mail/mail.module.js';
import { RedisModule } from '../../infrastructure/redis/redis.module.js';
import { OtpController } from './controllers/otp.controller.js';
import { OtpService } from './services/otp.service.js';
import { OtpRepository } from './repositories/otp.repository.js';
import { OtpGeneratorService } from './services/otp-generator.service.js';
import { OtpDeliveryService } from './services/otp-delivery.service.js';
import { IOtpService } from './interfaces/otp.service.interface.js';
import { IOtpRepository } from './interfaces/otp.repository.interface.js';
import { IOtpGenerator } from './interfaces/otp.generator.interface.js';
import { IOtpDeliveryService } from './interfaces/otp.delivery.interface.js';

@Module({
  imports: [MailModule, RedisModule],
  controllers: [OtpController],
  providers: [
    { provide: IOtpRepository, useClass: OtpRepository },
    { provide: IOtpGenerator, useClass: OtpGeneratorService },
    { provide: IOtpDeliveryService, useClass: OtpDeliveryService },
    { provide: IOtpService, useClass: OtpService },
  ],
  exports: [IOtpService, IOtpRepository, IOtpGenerator, IOtpDeliveryService],
})
export class OtpModule {}
