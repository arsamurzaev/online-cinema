import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
	_id?: mongoose.Types.ObjectId;

	@Prop({ unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ default: false })
	isAdmin?: boolean;

	@Prop({ default: [] })
	favorites?: [];
}

export const UserSchema = SchemaFactory.createForClass(User);
