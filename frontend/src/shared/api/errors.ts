import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const isFetchError = (err: unknown): err is FetchBaseQueryError =>
  typeof err === 'object' && err !== null && 'status' in err
