import { format, parseISO } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return format(d, 'yyyy-MM-dd')
}

export const formatDisplayDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = parseISO(dateString)
    return format(date, 'MMMM d, yyyy')
  } catch (error) {
    // Fallback for different date formats
    const date = new Date(dateString)
    return format(date, 'MMMM d, yyyy')
  }
}

export const getCurrentDate = () => {
  return formatDate(new Date())
}

export const getDatePlusDays = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return formatDate(date)
}