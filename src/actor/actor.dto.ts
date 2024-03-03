import { IsOptional, IsString } from 'class-validator';

export class ActorDto {
	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	slug?: string;

	@IsString()
	@IsOptional()
	photo?: string;
}
