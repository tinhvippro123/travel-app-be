import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Role } from './entities/role.entity.js';
import { LocalAccount } from './entities/local-account.entity.js';
import { UserController } from './controllers/user.controller.js';
import { UserRepository } from './repositories/user.repository.js';
import { UserService } from './services/user.service.js';
import { IUserRepository } from './interfaces/user-repository.interface.js';
import { IUserService } from './interfaces/user-service.interface.js';

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
