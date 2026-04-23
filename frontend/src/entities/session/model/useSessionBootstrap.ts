import { useEffect } from 'react'

import { useAppDispatch } from '@/shared/store'

import { sessionApi } from '../api/sessionApi'
import { bootstrapFinished, setCredentials } from './slice'

let bootstrapStarted = false

export const useSessionBootstrap = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (bootstrapStarted) return
    bootstrapStarted = true

    dispatch(sessionApi.endpoints.refresh.initiate(undefined, { track: false }))
      .unwrap()
      .then(({ accessToken }) => {
        dispatch(setCredentials(accessToken))
        dispatch(bootstrapFinished('done'))
      })
      .catch(() => dispatch(bootstrapFinished('error')))
  }, [dispatch])
}
