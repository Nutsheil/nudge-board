import { Navigate, Outlet } from 'react-router'

import { ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/store'
import { FullPageSpinner } from '@/shared/ui'

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
