import { Chip, Stack, Typography } from '@mui/material'

import { BrowserMockup } from '@/shared/ui'

import { FEATURES, FEATURES_HEADING, type Feature } from '../model/content'
import { Section } from './Section'
import { SectionHeading } from './SectionHeading'

const FeatureRow = ({ tag, title, description, icon, mockupLabel, reverse }: Feature) => (
  <Stack
    direction={{ xs: 'column', md: reverse ? 'row-reverse' : 'row' }}
    spacing={{ xs: 4, md: 10 }}
    sx={{ alignItems: 'center' }}
  >
    <Stack spacing={2.5} sx={{ width: '100%', flex: 1 }}>
      <Chip label={`+ ${tag}`} color='primary' variant='outlined' sx={{ width: 'fit-content' }} />
      <Typography variant='h4'>{title}</Typography>
      <Typography variant='body1' sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>
    </Stack>

    <BrowserMockup icon={icon} label={mockupLabel} height={338} />
  </Stack>
)

export const FeaturesSection = () => (
  <Section spacing={{ xs: 6, md: 10 }} dense>
    <SectionHeading title={FEATURES_HEADING.title} subtitle={FEATURES_HEADING.subtitle} />
    {FEATURES.map((feature) => (
      <FeatureRow key={feature.tag} {...feature} />
    ))}
  </Section>
)
