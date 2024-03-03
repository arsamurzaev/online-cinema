import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from './genre.model';

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(Genre.name) private readonly genreModel: Model<Genre>
	) {}
	async bySlug(slug: string) {
		return this.genreModel.findOne({ slug }).exec();
	}
	async getAll(searchTerm?: string) {
		let options = {};

		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'),
					},
					{
						slug: new RegExp(searchTerm, 'i'),
					},
					{
						description: new RegExp(searchTerm, 'i'),
					},
				],
			};
		}
		return this.genreModel
			.find(options)
			.select('-updateAt -__v')
			.sort({ createdAt: 'desc' })
			.exec();
	}

	async getCollections() {
		const genres = await this.getAll();
		const collections = genres;
		// Нужно доработать
		return collections;
	}

	// Admin place

	async getCount() {
		return this.genreModel.find().countDocuments().exec();
	}

	async byId(_id: string) {
		const genre = this.genreModel.findById(_id);
		if (!genre) {
			throw new NotFoundException('Жанр не найден');
		}
		return genre;
	}

	async create() {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: '',
		};

		const genre = await this.genreModel.create(defaultValue);

		return genre._id;
	}

	async update(_id: string, dto: CreateGenreDto) {
		const updateGenre = await this.genreModel
			.findByIdAndUpdate(_id, dto, {
				new: true,
			})
			.exec();

		if (!updateGenre) {
			throw new NotFoundException('Жанр не найден');
		}

		return updateGenre;
	}

	async delete(id: string) {
		const deleteGenre = await this.genreModel.findByIdAndDelete(id).exec();

		if (!deleteGenre) {
			throw new NotFoundException('Жанр не найден');
		}

		return deleteGenre;
	}
}
