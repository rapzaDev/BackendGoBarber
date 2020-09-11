import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '../errors/AppError';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface RequestDTO {
    userID: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    public async execute({
        userID,
        avatarFilename,
    }: RequestDTO): Promise<{ user: User }> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(userID);

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

        await usersRepository.save(user);

        return { user };
    }
}

export default UpdateUserAvatarService;
