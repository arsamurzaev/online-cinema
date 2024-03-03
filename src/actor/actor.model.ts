import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Actor {
	_id?: mongoose.Types.ObjectId;

	@Prop({ required: true })
	name: string;

	@Prop({ unique: true })
	slug: string;

	@Prop({ default: false })
	photo?: string;
}

export const ActorSchema = SchemaFactory.createForClass(Actor);
