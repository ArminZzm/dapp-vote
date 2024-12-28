import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

export const PATTERN = {
  'ddd, MMM DD, YYYY': 'ddd, MMM DD, YYYY',
  'YYYY-MM-DDTHH:mm': 'YYYY-MM-DDTHH:mm'
}

export const dateLocalizedFormat: (timestamp: number) => string = (timestamp) => {
  return dateFormat(timestamp, PATTERN['ddd, MMM DD, YYYY'])
}

export const dateFormat: (timestamp: number, pattern: string) => string = (timestamp, pattern) => {
  return dayjs(timestamp).format(pattern)
}

export const date2BigInt: (date: string | number | Date) => bigint = (date) => {
  return BigInt(new Date(date).getTime())
}

export const formatAddress: (address: string) => string = (address) => {
  return address.slice(0, 4) + '...' + address.slice(-4)
}

export const defaultStringifyWithBigInt: (obj: any) => string = (obj) => {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString()
    }
    return value
  })
}

export const isValidNumber = (value: any) => typeof value === 'number' && isFinite(value)
