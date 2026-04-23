import {
  type FetchArgs,
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'

export const AUTH_REQUIRED_ERROR = 'AUTH_REQUIRED'

const authRequiredError: FetchBaseQueryError = {
  status: 'CUSTOM_ERROR',
  error: AUTH_REQUIRED_ERROR,
  data: undefined,
}

export interface ReauthExtraOptions {
  skipReauth?: boolean
}

export type TBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, ReauthExtraOptions>

export interface CreateBaseQueryWithReauthOptions<TState, TRefreshResponse> {
  baseUrl: string
  refreshUrl: string
  getAccessToken: (state: TState) => string | null | undefined
  onRefreshSuccess: (data: TRefreshResponse, api: BaseQueryApi) => void
  onAuthFailed: (api: BaseQueryApi) => void
}

export const createBaseQueryWithReauth = <TState, TRefreshResponse>({
  baseUrl,
  refreshUrl,
  getAccessToken,
  onRefreshSuccess,
  onAuthFailed,
}: CreateBaseQueryWithReauthOptions<TState, TRefreshResponse>): TBaseQuery => {
  const mutex = new Mutex()

  const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const accessToken = getAccessToken(getState() as TState)
      if (accessToken) {
        headers.set('authorization', `Bearer ${accessToken}`)
      }
    },
  })

  const tryRefresh = async (api: BaseQueryApi): Promise<boolean> => {
    const result = await baseQuery({ url: refreshUrl, method: 'POST' }, api, {})
    if (result.data) {
      onRefreshSuccess(result.data as TRefreshResponse, api)
      return true
    }
    return false
  }

  // Если токен уже сброшен — другой параллельный запрос уже отработал onAuthFailed
  const fail = (api: BaseQueryApi) => {
    if (getAccessToken(api.getState() as TState)) {
      onAuthFailed(api)
    }
    return { error: authRequiredError }
  }

  return async (args, api, extraOptions) => {
    await mutex.waitForUnlock()

    // Снимок токена, с которым уходит запрос. Нужен, чтобы отличить «наш токен действительно протух»
    // от «пока запрос летел, параллельный цикл уже сделал refresh» — во втором случае достаточно простого retry.
    const tokenAtRequest = getAccessToken(api.getState() as TState)

    const result = await baseQuery(args, api, extraOptions)
    if (result.error?.status !== 401) return result

    // skipReauth: запрос сам управляет своим auth-флоу (bootstrap refresh, logout).
    if (extraOptions?.skipReauth) return result

    const currentToken = getAccessToken(api.getState() as TState)

    // Гость: токена нет, refresh смысла не имеет. Возвращаем исходный 401 с телом
    if (!currentToken) return result

    // Токен в сторе уже обновлён, пока наш запрос был в полёте (параллельный  цикл refresh успел отработать)
    if (currentToken !== tokenAtRequest) {
      const retry = await baseQuery(args, api, extraOptions)
      if (retry.error?.status === 401) return fail(api)
      return retry
    }

    if (mutex.isLocked()) {
      await mutex.waitForUnlock()
      // Если параллельный цикл refresh провалился, токен уже сброшен, retry гарантированно даст 401
      if (!getAccessToken(api.getState() as TState)) {
        return { error: authRequiredError }
      }
    } else {
      // fail() вызывается внутри lock, чтобы waiter'ы после unlock видели уже очищенный токен и не уходили в бесполезный retry.
      const ok = await mutex.runExclusive(async () => {
        if (await tryRefresh(api)) return true
        fail(api)
        return false
      })
      if (!ok) return { error: authRequiredError }
    }

    const retry = await baseQuery(args, api, extraOptions)
    if (retry.error?.status === 401) return fail(api)
    return retry
  }
}
