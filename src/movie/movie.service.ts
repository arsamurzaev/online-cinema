import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './movie.model';

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(Movie.name) private readonly movieModel: Model<Movie>
	) {}

	async getAll(searchTerm?: string) {
		let options = {};

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			};
		}

		// Aggregation

		return this.movieModel
			.find(options)
			.select('-updateAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('actors genres')
			.exec();
	}

	async bySlug(slug: string) {
		const doc = await this.movieModel
			.findOne({ slug })
			.populate('actors genres')
			.exec();
		if (!doc) throw new NotFoundException('Фильм не найден');
		return doc;
	}

	async byActors(actorId: string) {
		const doc = await this.movieModel.find({ actors: actorId }).exec();
		if (!doc) throw new NotFoundException('Фильмы не найден');
		return doc;
	}

	async byGenres(genreIds: Types.ObjectId[]) {
		const docs = await this.movieModel
			.find({ genres: { $in: genreIds } })
			.populate('actors genres')
			.exec();
		if (!docs) throw new NotFoundException('Фильмы не найден');
		return docs;
	}

	async getMostPopular() {
		return this.movieModel
			.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec();
	}

	async updateCountOpened(slug: string) {
		const updateDoc = await this.movieModel
			.findOneAndUpdate({ slug }, { $inc: { countOpened: 1 } }, { new: true })
			.exec();

		if (!updateDoc) {
			throw new NotFoundException('Фильм не найден');
		}

		return updateDoc;
	}
	// Admin place

	async getCount() {
		return this.movieModel.find().countDocuments().exec();
	}

	async byId(_id: string) {
		const movie = this.movieModel.findById(_id);
		if (!movie) {
			throw new NotFoundException('Фильм не найден');
		}
		return movie;
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			bigPoster: '',
			poster: '',
			actors: [],
			genres: [],
			title: '',
			videoUrl: '',
			slug: '',
		};

		const actor = await this.movieModel.create(defaultValue);

		return actor._id;
	}

	async update(_id: string, dto: UpdateMovieDto) {
		// Telegram notifications
		const updateDoc = await this.movieModel
			.findByIdAndUpdate(_id, dto, {
				new: true,
			})
			.exec();

		if (!updateDoc) {
			throw new NotFoundException('Фильм не найден');
		}

		return updateDoc;
	}

	async delete(id: string) {
		const deleteDoc = await this.movieModel.findByIdAndDelete(id).exec();

		if (!deleteDoc) {
			throw new NotFoundException('Фильм не найден');
		}

		return deleteDoc;
	}
}
