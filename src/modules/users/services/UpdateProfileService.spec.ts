// import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Tobias',
            email: 'tobias@gmail.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Tobias omshanti',
            email: 'tobiasoms@gmail.com',
        });

        expect(updatedUser?.name).toBe('Tobias omshanti');
        expect(updatedUser?.email).toBe('tobiasoms@gmail.com');
    });

    it('should be not able to update the profile from non-existing user', async () => {
        expect(
            updateProfile.execute({
                user_id: 'non-existing-user-id',
                name: 'null',
                email: 'null',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to change the email for another equal', async () => {
        await fakeUsersRepository.create({
            name: 'Tobias',
            email: 'tobias@gmail.com',
            password: '123456',
        });

        const user = await fakeUsersRepository.create({
            name: 'Test',
            email: 'test@gmail.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'test2',
                email: 'tobias@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Tobias',
            email: 'tobias@gmail.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Tobias omshanti',
            email: 'tobiasoms@gmail.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser?.password).toBe('123123');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Tobias',
            email: 'tobias@gmail.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Tobias omshanti',
                email: 'tobiasoms@gmail.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Tobias',
            email: 'tobias@gmail.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Tobias omshanti',
                email: 'tobiasoms@gmail.com',
                old_password: 'wrong-old-password',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
