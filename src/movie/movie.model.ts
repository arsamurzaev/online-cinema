import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Actor } from 'src/actor/actor.model';

export class Parameters {
	@Prop()
	year: number;

	@Prop()
	duration: number;

	@Prop()
	country: string;
}

@Schema({ timestamps: true })
export class Movie {
	@Prop()
	poster: string;

	@Prop()
	bigPoster: string;

	@Prop()
	title: string;

	@Prop()
	description: string;

	@Prop()
	videoUrl: string;

	@Prop({ default: 0 })
	countOpened?: number;

	@Prop({ default: 4 })
	rating?: number;

	@Prop({ unique: true })
	slug: string;

	@Prop()
	genres: string[];

	@Prop({ ref: () => Actor })
	actors: Ref<Actor>[];

	@Prop({ default: false })
	isSendTelegram?: boolean;

	@Prop()
	parameters?: Parameters;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
