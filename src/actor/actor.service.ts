import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActorDto } from './actor.dto';
import { Actor } from './actor.model';

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(Actor.name) private readonly actorModel: Model<Actor>
	) {}
	async bySlug(slug: string) {
		const doc = await this.actorModel.findOne({ slug }).exec();
		if (!doc) throw new NotFoundException('Актер не найден');
		return doc;
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
				],
			};
		}

		// Aggregation

		return this.actorModel
			.aggregate()
			.match(options)
			.lookup({
				from: 'Movie',
				foreignField: 'actors',
				localField: '_id',
				as: 'movies',
			}).addFields({
				countMovies: {
					$size: "$movies"
				}
			})
			.project({__v: 0, updatedAt: 0, movies: 0})
			.sort({ createdAt: -1 })
			.exec();
	}

	// Admin place

	async getCount() {
		return this.actorModel.find().countDocuments().exec();
	}

	async byId(_id: string) {
		const actor = this.actorModel.findById(_id);
		if (!actor) {
			throw new NotFoundException('Жанр не найден');
		}
		return actor;
	}

	async create() {
		const defaultValue: ActorDto = {
			name: '',
			slug: '',
			photo: '',
		};

		const actor = await this.actorModel.create(defaultValue);

		return actor._id;
	}

	async update(_id: string, dto: ActorDto) {
		const updateActor = await this.actorModel
			.findByIdAndUpdate(_id, dto, {
				new: true,
			})
			.exec();

		if (!updateActor) {
			throw new NotFoundException('Жанр не найден');
		}

		return updateActor;
	}

	async delete(id: string) {
		const deleteActor = await this.actorModel.findByIdAndDelete(id).exec();

		if (!deleteActor) {
			throw new NotFoundException('Жанр не найден');
		}

		return deleteActor;
	}
}
