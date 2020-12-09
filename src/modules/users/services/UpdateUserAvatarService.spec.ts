import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();

        updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );
    });

    it('should be able to update user avatar', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Tobias',
            email: 'tobias@gmail.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'tobias.jpg',
        });

        expect(user.avatar).toBe('tobias.jpg');
    });

    it('should not be able to update user avatar from non existing user', async () => {
        await expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFilename: 'tobias.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete avatar when updating new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'Tobias',
            email: 'tobias@gmail.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'tobias.jpg',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'tobias2.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('tobias.jpg');

        expect(user.avatar).toBe('tobias2.jpg');
    });
});
