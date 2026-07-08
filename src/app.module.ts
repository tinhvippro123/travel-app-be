import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './infrastructure/config/config.validation.js';

// Infrastructure modules
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { RedisModule } from './infrastructure/redis/redis.module.js';
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module.js';
import { MailModule } from './infrastructure/mail/mail.module.js';

// Feature modules
import { UserModule } from '@modules/user';
import { AuthModule } from '@modules/auth';
import { PlaceModule } from '@modules/place';
import { BookingModule } from '@modules/booking';
import { ContactModule } from '@modules/contact';

@Module({
  imports: [
    // ===== Config =====
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      envFilePath: '.env',
    }),

    // ===== Infrastructure =====
    DatabaseModule,
    RedisModule,
    CloudinaryModule,
    MailModule,

    // ===== Feature Modules =====
    UserModule,
    AuthModule,
    PlaceModule,
    BookingModule,
    ContactModule,
  ],
})
export class AppModule {}
