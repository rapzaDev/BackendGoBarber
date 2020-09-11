import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

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
