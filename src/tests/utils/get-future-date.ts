import { setYear, parseISO } from 'date-fns'

/**
 * Receives "2022-04-24" and returns "2023-04-24"
 */
export function getFutureDate (date: string): Date {
  const currentDate = parseISO(date)
  return setYear(currentDate, currentDate.getFullYear() + 1)
}
