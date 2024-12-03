import * as DFNS from 'date-fns'

export const getStartOfDay = (date: string | number | Date) => DFNS.startOfDay(date)

export const getEndOfDay = (date: string | number | Date) => DFNS.endOfDay(date)

export const getWeekRange = (weeksAgo: number) => {
    const currentDate = new Date()
    const startDate = DFNS.startOfWeek(DFNS.subWeeks(currentDate, weeksAgo), { weekStartsOn: 1 }) // Monday as start of week
    const endDate = DFNS.addDays(startDate, 4)

    return { startDate, endDate }
}

export const getMonthRange = (monthsAgo: number) => {
    const currentDate = new Date()
    const startDate = DFNS.startOfMonth(DFNS.subMonths(currentDate, monthsAgo)) // Start of the month
    const endDate = DFNS.endOfMonth(DFNS.subMonths(currentDate, monthsAgo)) // End of the month
    return { startDate, endDate }
}
