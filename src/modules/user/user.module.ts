import {
  User,
  Role,
  LocalAccount,
  IUserRepository,
  IUserService,
  IRoleRepository,
  IRoleService,
} from '@modules/user/index.js';
import { UserController } from './controllers/user.controller.js';
import { RoleController } from './controllers/role.controller.js';
import { UserRepository } from './repositories/user.repository.js';
import { RoleRepository } from './repositories/role.repository.js';
import { UserService } from './services/user.service.js';
import { RoleService } from './services/role.service.js';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([User, Role, LocalAccount])],
  controllers: [UserController, RoleController],
  providers: [
    // Map abstract class → concrete class cho DI
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IUserService, useClass: UserService },
    { provide: IRoleRepository, useClass: RoleRepository },
    { provide: IRoleService, useClass: RoleService },
  ],
  exports: [IUserService, IUserRepository, IRoleService, IRoleRepository],
})
export class UserModule {}
