import { Suspense } from 'react'
import { Outlet } from 'react-router'

import { FullPageSpinner } from '@/shared/ui'

export const AuthLayout = () => (
  <Suspense fallback={<FullPageSpinner />}>
    <Outlet />
  </Suspense>
)
