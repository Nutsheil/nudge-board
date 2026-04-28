import { Navigate, Outlet } from 'react-router'

import { FullPageSpinner } from '@/shared/ui'
import { useAppSelector } from '@/shared/store'
import { ROUTES } from '@/shared/config'

export const PrivateRoute = () => {
  const { isAuth, bootstrapStatus } = useAppSelector((state) => state.session)

  if (bootstrapStatus === 'pending') {
    return <FullPageSpinner />
  }

  if (!isAuth) {
    return <Navigate to={ROUTES.auth} replace />
  }

  return <Outlet />
}
