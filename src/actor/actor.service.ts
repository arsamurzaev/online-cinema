import { Injectable, NotFoundException } from '@nestjs/common';
import { Actor } from './actor.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ActorDto } from './actor.dto';

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(Actor.name) private readonly actorModel: Model<Actor>
	) {}
	async bySlug(slug: string) {
		return this.actorModel.findOne({ slug }).exec();
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
			.find(options)
			.select('-updateAt -__v')
			.sort({ createdAt: 'desc' })
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
