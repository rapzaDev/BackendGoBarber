import { injectable, inject } from 'tsyringe';

// import User from '@modules/users/infra/typeorm/entities/User';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
// import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
    ) {}

    public async execute({ email }: IRequestDTO): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            const message = 'User does not exists';
            const statusCode = 400;
            throw new AppError({ message, statusCode });
        }

        await this.userTokensRepository.generate(user.id);

        this.mailProvider.sendMail(email, 'Password recovery request received');
    }
}

export default SendForgotPasswordEmailService;
