import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';

import uploadConfig from '@config/upload';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import CreateUserService from '@modules/users/services/CreateUserService';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
        name,
        email,
        password,
    });

    delete user.password;

    return response.json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const updateUserAvatar = container.resolve(UpdateUserAvatarService);
        const { user } = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        delete user.password;
        delete user.email;

        return response.json({ user });
    },
);

export default usersRouter;
