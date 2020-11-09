import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import AppError from '@shared/errors/AppError';

interface RequestDTO {
    providerID: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({
        providerID,
        date,
    }: RequestDTO): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );

        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
        );

        const message = 'This appointed is already booked';
        const statusCode = 400;

        if (findAppointmentInSameDate) {
            throw new AppError({ message, statusCode });
        }

        const appointment = appointmentsRepository.create({
            providerID,
            date: appointmentDate,
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
