import { UserResponseDto } from '@modules/user';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
}
