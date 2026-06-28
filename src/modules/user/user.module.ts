import { User, Role, LocalAccount } from '@modules/user/entities/index.js';
import { UserController } from '@modules/user/controllers/index.js';
import { UserRepository } from '@modules/user/repositories/index.js';
import { UserService } from '@modules/user/services/index.js';
import {
  IUserRepository,
  IUserService,
} from '@modules/user/interfaces/index.js';
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
