import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import AppError from '../errors/AppError';

import authConfig from '../config/auth';

import User from '../models/User';

interface RequestDTO {
    email: string;
    password: string;
}

class AuthenticateUserService {
    public async execute({
        email,
        password,
    }: RequestDTO): Promise<{ user: User; token: string }> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({ where: { email } });

        const message = 'Incorret email/password combination.';
        const statusCode = 401;

        if (!user) {
            throw new AppError({ message, statusCode });
        }

        const passwordMatched = await compare(password, user.password);

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
