import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Genre {

	@Prop({ unique: true })
	slug: string;

	@Prop({ default: '' })
	name: string;

	@Prop({ default: '' })
	description: string;

	@Prop({ default: '' })
	icon: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
