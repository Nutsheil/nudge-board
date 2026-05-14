import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'

import { i18n } from '@/shared/config/i18n'

interface Props {
  children: ReactNode
}

export const I18nProvider = (props: Props) => {
  const { children } = props

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
