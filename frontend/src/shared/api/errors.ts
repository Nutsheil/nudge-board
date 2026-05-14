import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const isFetchError = (err: unknown): err is FetchBaseQueryError =>
  typeof err === 'object' && err !== null && 'status' in err

interface GetErrorKeyOptions {
  fallback: string
  byStatus?: Record<number, string>
}

export const getErrorKey = (err: unknown, options: GetErrorKeyOptions): string => {
  if (isFetchError(err)) {
    if (typeof err.status === 'number') {
      const specific = options.byStatus?.[err.status]
      if (specific) return specific
      if (err.status >= 500) return 'errors.server.unavailable'
    }
    if (err.status === 'FETCH_ERROR') return 'errors.network.offline'
  }
  return options.fallback
}
