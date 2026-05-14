import { useTranslation } from 'react-i18next'

export const useTranslateError = () => {
  const { t } = useTranslation()

  return (message: string | undefined): string | undefined => {
    if (!message) return undefined
    return t(message)
  }
}
