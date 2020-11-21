import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
    email: string;
    password: string;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        email,
        password,
    }: IRequestDTO): Promise<{ user: User; token: string }> {
        const user = await this.usersRepository.findByEmail(email);

        const message = 'Incorret email/password combination.';
        const statusCode = 401;

        if (!user) {
            throw new AppError({ message, statusCode });
        }

        const passwordMatched = await this.hashProvider.compareHash(
            password,
            user.password,
        );

        if (!passwordMatched) {
            throw new AppError({ message, statusCode });
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthenticateUserService;
