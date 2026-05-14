import { Chip, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { BrowserMockup } from '@/shared/ui'

import { FEATURES, type FeatureMeta } from '../model/content'
import { Section } from './Section'
import { SectionHeading } from './SectionHeading'

const FeatureRow = ({ id, icon, reverse }: FeatureMeta) => {
  const { t } = useTranslation('landing')

  return (
    <Stack
      direction={{ xs: 'column', md: reverse ? 'row-reverse' : 'row' }}
      spacing={{ xs: 4, md: 10 }}
      sx={{ alignItems: 'center' }}
    >
      <Stack spacing={2.5} sx={{ width: '100%', flex: 1 }}>
        <Chip
          label={`+ ${t(`landing.features.${id}.tag`)}`}
          color='primary'
          variant='outlined'
          sx={{ width: 'fit-content' }}
        />
        <Typography variant='h4'>{t(`landing.features.${id}.title`)}</Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary' }}>
          {t(`landing.features.${id}.description`)}
        </Typography>
      </Stack>

      <BrowserMockup icon={icon} label={t(`landing.features.${id}.mockupLabel`)} height={338} />
    </Stack>
  )
}

export const FeaturesSection = () => {
  const { t } = useTranslation('landing')

  return (
    <Section spacing={{ xs: 6, md: 10 }} dense>
      <SectionHeading title={t('landing.features.heading.title')} subtitle={t('landing.features.heading.subtitle')} />
      {FEATURES.map((feature) => (
        <FeatureRow key={feature.id} {...feature} />
      ))}
    </Section>
  )
}
