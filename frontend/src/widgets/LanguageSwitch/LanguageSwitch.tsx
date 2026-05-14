import { IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

import { DEFAULT_LANGUAGE, isLanguage, type Language } from '@/shared/config/i18n'

const SquareIconButton = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: 700,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
}))

const NEXT_LANGUAGE: Record<Language, Language> = {
  ru: 'en',
  en: 'ru',
}

export const LanguageSwitch = () => {
  const { i18n, t } = useTranslation()

  const current: Language = isLanguage(i18n.language) ? i18n.language : DEFAULT_LANGUAGE

  const handleToggle = () => {
    i18n.changeLanguage(NEXT_LANGUAGE[current])
  }

  return (
    <SquareIconButton
      onClick={handleToggle}
      color='inherit'
      aria-label={t('common.languageSwitch.aria', { defaultValue: 'Switch language' })}
    >
      {current}
    </SquareIconButton>
  )
}
