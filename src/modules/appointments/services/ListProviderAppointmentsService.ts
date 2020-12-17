import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequestDTO {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        day,
        month,
        year,
    }: IRequestDTO): Promise<Appointment[]> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                provider_id,
                day,
                month,
                year,
            },
        );

        return appointments;
    }
}

export default ListProviderAppointmentsService;
