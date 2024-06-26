import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/user.model';

export class OnlyAdminGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<{ user: User }>();
		const user = request.user;

		if (!user.isAdmin) {
			throw new ForbiddenException('У вас недостаточно прав');
		}

		return user.isAdmin;
	}
}
