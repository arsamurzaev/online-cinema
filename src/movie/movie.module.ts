import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieController } from './movie.controller';
import { Movie, MovieSchema } from './movie.model';
import { MovieService } from './movie.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
	],
	controllers: [MovieController],
	providers: [MovieService],
})
export class MovieModule {}
