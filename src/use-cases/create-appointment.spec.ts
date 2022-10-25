import { describe, expect, it } from 'vitest'
import { Appointment } from '../entities/appointment'
import { InMemoryAppointmentsRepository } from '../repositories/in-memory/in-memory-appointments-repository'
import { getFutureDate } from '../tests/utils/get-future-date'
import { CreateAppointment } from './create-appointment'

describe('Create Appointment', () => {
  it('should be able to create an appointment', () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository()
    // SUT = System Under Test
    const sut = new CreateAppointment(appointmentsRepository)

    const startsAt = getFutureDate('2022-10-20')
    const endsAt = getFutureDate('2022-10-21')

    expect(sut.execute({
      customer: 'John Doe',
      startsAt,
      endsAt
    })).resolves.toBeInstanceOf(Appointment)
  })

  it('should not be able to create an appointment with overlapping dates', async () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository()
    // SUT = System Under Test
    const sut = new CreateAppointment(appointmentsRepository)

    const startsAt = getFutureDate('2022-10-20')
    const endsAt = getFutureDate('2022-10-27')

    await sut.execute({
      customer: 'John Doe',
      startsAt,
      endsAt
    })

    expect(sut.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2022-10-25'),
      endsAt: getFutureDate('2022-10-29')
    })).rejects.toBeInstanceOf(Error)

    expect(sut.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2022-10-18'),
      endsAt: getFutureDate('2022-10-21')
    })).rejects.toBeInstanceOf(Error)

    expect(sut.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2022-10-15'),
      endsAt: getFutureDate('2022-10-30')
    })).rejects.toBeInstanceOf(Error)

    expect(sut.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2022-10-22'),
      endsAt: getFutureDate('2022-10-26')
    })).rejects.toBeInstanceOf(Error)
  })
})
