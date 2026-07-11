import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from '@infrastructure/config/config.validation';

// Infrastructure modules
import { DatabaseModule } from '@infrastructure/database/database.module';
import { RedisModule } from '@infrastructure/redis/redis.module';
import { CloudinaryModule } from '@infrastructure/cloudinary/cloudinary.module';
import { MailModule } from '@infrastructure/mail/mail.module';

// Feature modules
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { PlaceModule } from '@modules/place';
import { BookingModule } from '@modules/booking/booking.module';
import { ReviewModule } from '@modules/review';

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
    ReviewModule,
  ],
})
export class AppModule {}
