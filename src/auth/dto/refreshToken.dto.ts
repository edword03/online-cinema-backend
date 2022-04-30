import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({
    message: 'You did not pass this refresh token or token is not a string',
  })
  refreshToken: string;
}
