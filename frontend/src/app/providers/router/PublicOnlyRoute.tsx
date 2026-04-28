import { Navigate, Outlet } from 'react-router'

import { FullPageSpinner } from '@/shared/ui'
import { useAppSelector } from '@/shared/store'
import { ROUTES } from '@/shared/config'

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
