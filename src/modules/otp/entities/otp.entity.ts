export enum OtpType {
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot_password',
}

export class Otp {
  code: string;
  type: OtpType;

  constructor(partial: Partial<Otp>) {
    Object.assign(this, partial);
  }
}