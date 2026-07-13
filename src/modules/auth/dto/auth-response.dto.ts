import { UserResponseDto } from '@modules/user/index';

export class AuthResponseDto {
  accessToken: string;
  user: UserResponseDto;
}
