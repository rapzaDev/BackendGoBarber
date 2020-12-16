import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

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
    ) {}

    public async execute({
        provider_id,
        user_id,
        date,
    }: IRequestDTO): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

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

        return appointment;
    }
}

export default CreateAppointmentService;
