import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
	@IsEmail()
	email: string;

	@IsString()
    @IsOptional()
	password?: string;

	@IsBoolean()
	@IsOptional()
	isAdmin?: boolean;
}
