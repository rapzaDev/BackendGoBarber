import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    user_id: string;
}

@injectable()
class ShowProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ user_id }: IRequestDTO): Promise<User | undefined> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            const message = 'User not found';
            const statusCode = 400;
            throw new AppError({ message, statusCode });
        }

        return user;
    }
}

export default ShowProfileService;
