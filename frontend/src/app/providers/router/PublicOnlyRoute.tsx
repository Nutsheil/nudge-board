import { Navigate, Outlet } from 'react-router'

import { ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/store'
import { FullPageSpinner } from '@/shared/ui'

export const PublicOnlyRoute = () => {
  const { isAuth, bootstrapStatus } = useAppSelector((state) => state.session)

  if (bootstrapStatus === 'pending') {
    return <FullPageSpinner />
  }

  if (isAuth) {
    return <Navigate to={ROUTES.app} replace />
  }

  return <Outlet />
}
