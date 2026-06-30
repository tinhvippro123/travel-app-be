import { UserResponseDto } from '@modules/user/index.js';

export class AuthResponseDto {
  accessToken: string;
  user: UserResponseDto;
}
