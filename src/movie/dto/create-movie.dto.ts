import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class Parameters {
	@IsNumber()
	year: number;

	@IsNumber()
	duration: number;

	@IsNumber()
	country: string;
}

export class CreateMovieDto {
	@IsString()
	poster: string;

	@IsString()
	bigPoster: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsString()
	videoUrl: string;

	@IsString()
	slug: string;

	@IsArray()
	@IsString({ each: true })
	genres: string[];

	@IsArray()
	@IsString({ each: true })
	actors: string[];

	@IsString()
	isSendTelegram?: boolean;

	@IsObject()
	parameters?: Parameters;
}
