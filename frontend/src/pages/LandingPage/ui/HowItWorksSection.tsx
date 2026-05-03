import { Box, Stack, Typography } from '@mui/material'

import { HOW_IT_WORKS_HEADING, STEPS, type Step } from '../model/content'
import { Section } from './Section'
import { SectionHeading } from './SectionHeading'

const StepCard = ({ step }: { step: Step }) => (
  <Stack
    spacing={2.5}
    sx={{
      flex: 1,
      width: '100%',
      bgcolor: (t) => t.palette.surface.cardDeep,
      borderLeft: 3,
      borderColor: 'primary.main',
      borderRadius: 2,
      px: 4,
      py: 3,
      minHeight: 280,
    }}
  >
    <Box sx={{ color: 'primary.main', opacity: 0.8 }}>{step.icon}</Box>
    <Typography sx={{ color: 'primary.main', opacity: 0.35, fontWeight: 800, fontSize: 56, lineHeight: 1 }}>
      {step.num}
    </Typography>
    <Typography variant='h6'>{step.title}</Typography>
    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
      {step.description}
    </Typography>
  </Stack>
)

export const HowItWorksSection = () => (
  <Section sx={{ alignItems: 'center' }}>
    <SectionHeading title={HOW_IT_WORKS_HEADING.title} subtitle={HOW_IT_WORKS_HEADING.subtitle} />

    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: `repeat(${STEPS.length}, 1fr)` },
        gap: 3,
        width: '100%',
      }}
    >
      {STEPS.map((step) => (
        <StepCard key={step.num} step={step} />
      ))}
    </Box>
  </Section>
)
