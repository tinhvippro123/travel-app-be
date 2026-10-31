import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { UserRole } from '../../../common/enums/index.js';
import { RolesGuard } from './roles.guard.js';

describe('RolesGuard', () => {
  const reflector = new Reflector();
  const guard = new RolesGuard(reflector);
  afterEach(() => jest.restoreAllMocks());

  it('allows routes without role restrictions', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(new ExecutionContextHost([{}]))).toBe(true);
  });

  it('allows the required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);
    const context = new ExecutionContextHost([
      { user: { role: UserRole.ADMIN } },
    ]);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects an authenticated user with the wrong role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);
    const context = new ExecutionContextHost([
      { user: { role: UserRole.USER } },
    ]);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('rejects missing authentication without crashing on user.role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);
    expect(() => guard.canActivate(new ExecutionContextHost([{}]))).toThrow(
      ForbiddenException,
    );
  });
});
