import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({
        name,
        email,
        password,
    }: IRequestDTO): Promise<User> {
        const checkUserExists = await this.usersRepository.findByEmail(email);

        const message = 'Email address already used.';
        const statusCode = 400;

        if (checkUserExists) {
            throw new AppError({ message, statusCode });
        }

        const hashedPassword = await hash(password, 8);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        return user;
    }
}

export default CreateUserService;
