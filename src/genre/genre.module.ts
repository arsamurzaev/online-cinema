import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreController } from './genre.controller';
import { Genre, GenreSchema } from './genre.model';
import { GenreService } from './genre.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
		ConfigModule,
	],
	controllers: [GenreController],
	providers: [GenreService],
})
export class GenreModule {}
