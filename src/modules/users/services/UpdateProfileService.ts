import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfile {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        user_id,
        name,
        email,
        old_password,
        password,
    }: IRequestDTO): Promise<User | undefined> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            const message = 'User not found';
            const statusCode = 400;
            throw new AppError({ message, statusCode });
        }

        const userWhitEqualEmail = await this.usersRepository.findByEmail(
            email,
        );

        if (userWhitEqualEmail && userWhitEqualEmail.id !== user.id) {
            const message = 'E-mail already in use.';
            const statusCode = 401;
            throw new AppError({ message, statusCode });
        }

        user.name = name;
        user.email = email;

        if (password && !old_password) {
            const message =
                'The old password is required to change to a new password';
            const statusCode = 400;
            throw new AppError({ message, statusCode });
        }

        if (password && old_password) {
            const oldPasswordCheck = await this.hashProvider.compareHash(
                old_password,
                user.password,
            );

            if (!oldPasswordCheck) {
                const message = 'Old password does not match.';
                const statusCode = 401;
                throw new AppError({ message, statusCode });
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateProfile;
