import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>
	) {}
	async byId(_id: string) {
		const user = this.userModel.findById(_id);
		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}
		return user;
	}

	async updateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.byId(_id);
		const isSameUser = await this.userModel.findOne({ email: dto.email });

		if (isSameUser && String(_id) !== String(isSameUser._id)) {
			throw new NotFoundException('Почта занята');
		}

		if (dto.password) {
			const salt = await genSalt(10);
			user.password = await hash(dto.password, salt);
		}

		user.email = dto.email;
		if (dto.isAdmin || dto.isAdmin === false) {
			user.isAdmin = dto.isAdmin;
		}

		await user.save();

		return;
	}

	async getCount() {
		return this.userModel.find().countDocuments().exec();
	}

	async getAll(searchTerm?: string) {
		let options = {};

		if (searchTerm) {
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i'),
					},
				],
			};
		}
		return this.userModel
			.find(options)
			.select('-password -updateAt -__v')
			.sort({ createdAt: 'desc' });
	}

	async delete(id: string) {
		return this.userModel.findByIdAndDelete(id).exec;
	}
}
