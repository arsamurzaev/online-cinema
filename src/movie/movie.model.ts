import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Actor } from 'src/actor/actor.model';
import { Genre } from 'src/genre/genre.model';

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
	_id?: Types.ObjectId;

	@Prop()
	poster: string;

	@Prop()
	bigPoster: string;

	@Prop()
	title: string;

	@Prop()
	videoUrl: string;

	@Prop({ default: 0 })
	countOpened?: number;

	@Prop({ default: 4 })
	rating?: number;

	@Prop({ unique: true })
	slug: string;

	@Prop([{ type: "ObjectId", ref: 'Genre' }])
	genres: Genre[];

	@Prop([{ type: "Objectid", ref: 'Actor' }])
	actors: Actor[];

	@Prop({ default: false })
	isSendTelegram?: boolean;

	@Prop()
	parameters?: Parameters;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
