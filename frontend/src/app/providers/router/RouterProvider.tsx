import { createBrowserRouter, RouterProvider as BaseRouterProvider } from 'react-router'

import { AppLayout, AuthLayout, PublicLayout } from '@/app/layouts'
import { AppPage } from '@/pages/AppPage'
import { AuthPage } from '@/pages/AuthPage'
import { LandingPage } from '@/pages/LandingPage'
import { ROUTES } from '@/shared/config'

import { PrivateRoute } from './PrivateRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'
import { RouteErrorElement } from './RouteErrorElement'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorElement variant='public' />,
    children: [{ index: true, element: <LandingPage /> }],
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        errorElement: <RouteErrorElement variant='auth' />,
        children: [{ path: ROUTES.auth, element: <AuthPage /> }],
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        errorElement: <RouteErrorElement variant='app' />,
        children: [{ path: ROUTES.app, element: <AppPage /> }],
      },
    ],
  },
])

export const RouterProvider = () => <BaseRouterProvider router={router} />
