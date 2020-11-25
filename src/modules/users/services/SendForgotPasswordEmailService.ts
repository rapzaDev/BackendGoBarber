import { injectable, inject } from 'tsyringe';

// import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
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
    ) {}

    public async execute({ email }: IRequestDTO): Promise<void> {
        this.mailProvider.sendMail(email, 'Password recovery request received');
    }
}

export default SendForgotPasswordEmailService;
