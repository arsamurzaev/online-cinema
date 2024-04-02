import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
		private readonly jwtService: JwtService
	) {}

	async login(authDto: AuthDto) {
		const user = await this.validateUser(authDto);

		const tokens = await this.issueTokenPair(String(user._id));

		return {
			user: this.returnUserFields(user),
			...tokens,
		};
	}
	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) {
			throw new UnauthorizedException('Пожалуйста войдите в систему');
		}

		const result = await this.jwtService.verifyAsync(refreshToken);
		if (!result) {
			throw new UnauthorizedException('Токен недействителен');
		}

		const user = await this.userModel.findById(result._id);

		const tokens = await this.issueTokenPair(String(user._id));

		return {
			user: this.returnUserFields(user),
			...tokens,
		};
	}

	async register(authDto: AuthDto) {
		const oldUser = await this.userModel.findOne({ email: authDto.email });
		if (oldUser)
			throw new BadRequestException(
				'Пользователь с такие email уже существует'
			);

		const salt = await genSalt(10);

		const newUser = new this.userModel({
			email: authDto.email,
			password: await hash(authDto.password, salt),
		});

		const tokens = await this.issueTokenPair(String(newUser._id));

		newUser.save();
		return {
			user: this.returnUserFields(newUser),
			...tokens,
		};
	}

	async validateUser(authDto: AuthDto): Promise<User> {
		const user = await this.userModel.findOne({ email: authDto.email });
		if (!user) {
			throw new UnauthorizedException('Пользователь не найден');
		}

		const isValidPassword = await compare(authDto.password, user.password);
		if (!isValidPassword) {
			throw new UnauthorizedException('Неправильный пароль');
		}
		return user;
	}

	async issueTokenPair(userId: string) {
		const data = { _id: userId };

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d',
		});

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h',
		});

		return { refreshToken, accessToken };
	}

	returnUserFields(user: User) {
		return {
			_id: user._id,
			email: user.email,
			isAdmin: user.isAdmin,
		};
	}
}
