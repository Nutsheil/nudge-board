import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { STEPS, type StepMeta } from '../model/content'
import { Section } from './Section'
import { SectionHeading } from './SectionHeading'

const StepCard = ({ step }: { step: StepMeta }) => {
  const { t } = useTranslation('landing')

  return (
    <Stack
      spacing={2.5}
      sx={{
        flex: 1,
        width: '100%',
        bgcolor: (theme) => theme.palette.surface.cardDeep,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        px: 4,
        py: 3,
        minHeight: 280,
      }}
    >
      <Box sx={{ color: 'primary.main' }}>{step.icon}</Box>
      <Typography sx={{ color: 'text.disabled', fontWeight: 700, fontSize: 32, lineHeight: 1 }}>
        {step.num}
      </Typography>
      <Typography variant='h6'>{t(`landing.howItWorks.steps.${step.id}.title`)}</Typography>
      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
        {t(`landing.howItWorks.steps.${step.id}.description`)}
      </Typography>
    </Stack>
  )
}

export const HowItWorksSection = () => {
  const { t } = useTranslation('landing')

  return (
    <Section sx={{ alignItems: 'center' }}>
      <SectionHeading
        title={t('landing.howItWorks.heading.title')}
        subtitle={t('landing.howItWorks.heading.subtitle')}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: `repeat(${STEPS.length}, 1fr)` },
          gap: 3,
          width: '100%',
        }}
      >
        {STEPS.map((step) => (
          <StepCard key={step.id} step={step} />
        ))}
      </Box>
    </Section>
  )
}
