import { createBrowserRouter, RouterProvider as BaseRouterProvider } from 'react-router'

import { AppLayout, AuthLayout, PublicLayout } from '@/app/layouts'
import { AuthPage } from '@/pages/AuthPage'
import { BoardPage } from '@/pages/BoardPage'
import { LandingPage } from '@/pages/LandingPage'
import { WorkspacePage } from '@/pages/WorkspacePage'
import { WorkspaceSelectionPage } from '@/pages/WorkspaceSelectionPage'
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
        children: [
          { path: ROUTES.app, element: <WorkspaceSelectionPage /> },
          { path: ROUTES.workspacePattern, element: <WorkspacePage /> },
          { path: ROUTES.boardPattern, element: <BoardPage /> },
        ],
      },
    ],
  },
])

export const RouterProvider = () => <BaseRouterProvider router={router} />
