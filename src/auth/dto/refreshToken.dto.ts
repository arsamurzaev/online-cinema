import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({
    message: 'У тебя нет токена или токен не является строкой ',
  })
  refreshToken: string;
}
