import {
  User,
  Role,
  LocalAccount,
  IUserRepository,
  IUserService,
} from '@modules/user/index.js';
import { UserController } from './controllers/user.controller.js';
import { UserRepository } from './repositories/user.repository.js';
import { UserService } from './services/user.service.js';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([User, Role, LocalAccount])],
  controllers: [UserController],
  providers: [
    // Map abstract class → concrete class cho DI
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IUserService, useClass: UserService },
  ],
  exports: [IUserService, IUserRepository],
})
export class UserModule {}
