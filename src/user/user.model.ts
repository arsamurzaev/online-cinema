import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Movie } from 'src/movie/movie.model';

@Schema({ timestamps: true })
export class User {
	_id?: Types.ObjectId;

	@Prop({ unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ default: false })
	isAdmin?: boolean;

	@Prop({ type: "ObjectId", ref: 'Movie' })
	favorites?: Movie[];
}

export const UserSchema = SchemaFactory.createForClass(User);
