import { createBrowserRouter, RouterProvider as BaseRouterProvider } from 'react-router'

import { AppLayout, AuthLayout, PublicLayout } from '@/app/layouts'
import { LandingPage } from '@/pages/LandingPage'
import { AuthPage } from '@/pages/AuthPage'
import { AppPage } from '@/pages/AppPage'

import { PrivateRoute } from './PrivateRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [{ index: true, element: <LandingPage /> }],
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [{ path: 'auth', element: <AuthPage /> }],
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [{ path: 'app', element: <AppPage /> }],
      },
    ],
  },
])

export const RouterProvider = () => <BaseRouterProvider router={router} />
