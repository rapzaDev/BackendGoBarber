import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    constructor(private usersRepository: IUsersRepository) {}

    public async execute({
        user_id,
        avatarFilename,
    }: IRequestDTO): Promise<{ user: User }> {
        const user = await this.usersRepository.findById(user_id);

        const message = 'Only authenticated users can change avatar.';
        const statusCode = 401;

        if (!user) {
            throw new AppError({ message, statusCode });
        }

        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );

            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        await this.usersRepository.save(user);

        return { user };
    }
}

export default UpdateUserAvatarService;
