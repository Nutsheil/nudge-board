import { Navigate, Outlet } from 'react-router'

import { FullPageSpinner } from '@/shared/ui'
import { useAppSelector } from '@/shared/store'

export const PublicOnlyRoute = () => {
  const { isAuth, bootstrapStatus } = useAppSelector((state) => state.session)

  if (bootstrapStatus === 'pending') {
    return <FullPageSpinner />
  }

  if (isAuth) {
    return <Navigate to='/app' replace />
  }

  return <Outlet />
}
