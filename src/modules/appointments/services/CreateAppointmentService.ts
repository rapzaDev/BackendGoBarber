import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,
    ) {}

    public async execute({
        provider_id,
        user_id,
        date,
    }: IRequestDTO): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        if (isBefore(appointmentDate, Date.now())) {
            const message = 'You cannot create an appointment on a past date';
            const statusCode = 400;
            throw new AppError({ message, statusCode });
        }

        if (user_id === provider_id) {
            const message = 'You cannot create an appointment with yourself';
            const statusCode = 400;
            throw new AppError({ message, statusCode });
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            const message =
                'You can only create appointments between 8am and 5pm';
            const statusCode = 400;
            throw new AppError({ message, statusCode });
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        const message = 'This appointed is already booked';
        const statusCode = 400;

        if (findAppointmentInSameDate) {
            throw new AppError({ message, statusCode });
        }

        const appointment = this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        });

        const dateFormatted = format(
            appointmentDate,
            "dd/MM/yyyy 'at' HH:mm'h'",
        );

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `New appointment for day ${dateFormatted}`,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
