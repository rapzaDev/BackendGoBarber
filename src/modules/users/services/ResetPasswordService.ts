import { injectable, inject } from 'tsyringe';

// import User from '@modules/users/infra/typeorm/entities/User';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
    ) {}

    public async execute({ token, password }: IRequestDTO): Promise<void> {
        const userToken = await this.userTokensRepository.findByToken(token);

        if (!userToken) {
            const message = 'User token does not exists';
            const statusCode = 400;
            throw new AppError({ message, statusCode });
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        if (!user) {
            const message = 'User does not exists';
            const statusCode = 400;
            throw new AppError({ message, statusCode });
        }

        user.password = password;

        await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;
