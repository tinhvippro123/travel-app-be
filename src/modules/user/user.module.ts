import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { IUserRepository } from './interfaces/user-repository.interface';
import { IUserService } from './interfaces/user-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    // Map abstract class → concrete class cho DI
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IUserService, useClass: UserService },
  ],
  exports: [IUserService, IUserRepository],
})
export class UserModule {}
