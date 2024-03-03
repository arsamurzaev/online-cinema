import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { Actor, ActorSchema } from './actor.model';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Actor.name, schema: ActorSchema }]),
		ConfigModule,
	],
	controllers: [ActorController],
	providers: [ActorService],
})
export class ActorModule {}
