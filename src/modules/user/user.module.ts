import {
  User,
  Role,
  LocalAccount,
  IUserRepository,
  IUserService,
  IRoleRepository,
  IRoleService,
} from '@modules/user';
import { UserController } from '@modules/user/controllers';
import { RoleController } from '@modules/user/controllers';
import { UserRepository } from '@modules/user/repositories';
import { RoleRepository } from '@modules/user/repositories';
import { UserService } from '@modules/user/services';
import { RoleService } from '@modules/user/services';
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
