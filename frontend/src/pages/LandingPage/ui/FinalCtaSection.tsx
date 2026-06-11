import ArrowForward from '@mui/icons-material/ArrowForward'
import { Button, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { ROUTES } from '@/shared/config'
import { radii } from '@/shared/config/theme'

import { Section } from './Section'

export const FinalCtaSection = () => {
  const { t } = useTranslation('landing')

  return (
    <Section dense sx={{ py: { xs: 8, md: 10 } }}>
      <Stack
        spacing={4}
        sx={{
          background: (theme) =>
            `linear-gradient(180deg, ${theme.palette.surface.ctaGradientTop} 0%, ${theme.palette.background.default} 100%)`,
          border: 1,
          borderColor: 'divider',
          borderRadius: `${radii.lg}px`,
          alignItems: 'center',
          px: { xs: 4, md: 10 },
          py: { xs: 6, md: 10 },
          textAlign: 'center',
        }}
      >
        <Typography variant='h2'>{t('landing.finalCta.title')}</Typography>
        <Typography variant='subtitle1' component='p' sx={{ color: 'text.secondary' }}>
          {t('landing.finalCta.subtitle')}
        </Typography>
        <Button
          component={Link}
          to={ROUTES.auth}
          variant='contained'
          endIcon={<ArrowForward />}
          sx={{ px: 4.5, py: 2 }}
        >
          {t('landing.finalCta.cta')}
        </Button>
        <Typography variant='caption' sx={{ color: (theme) => theme.palette.textExtra.tertiary }}>
          {t('landing.finalCta.caption')}
        </Typography>
      </Stack>
    </Section>
  )
}
