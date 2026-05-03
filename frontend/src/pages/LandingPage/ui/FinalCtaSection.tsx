import ArrowForward from '@mui/icons-material/ArrowForward'
import { Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'

import { ROUTES } from '@/shared/config'

import { FINAL_CTA_CONTENT } from '../model/content'
import { Section } from './Section'

export const FinalCtaSection = () => (
  <Section dense sx={{ py: { xs: 8, md: 10 } }}>
    <Stack
      spacing={4}
      sx={{
        background: (t) =>
          `linear-gradient(180deg, ${t.palette.surface.ctaGradientTop} 0%, ${t.palette.background.default} 100%)`,
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        alignItems: 'center',
        px: { xs: 4, md: 10 },
        py: { xs: 6, md: 10 },
        textAlign: 'center',
      }}
    >
      <Typography variant='h2'>{FINAL_CTA_CONTENT.title}</Typography>
      <Typography variant='subtitle1' sx={{ color: 'text.secondary' }}>
        {FINAL_CTA_CONTENT.subtitle}
      </Typography>
      <Button
        component={Link}
        to={ROUTES.auth}
        variant='contained'
        endIcon={<ArrowForward />}
        sx={{ borderRadius: 1.5, px: 4.5, py: 2 }}
      >
        {FINAL_CTA_CONTENT.cta}
      </Button>
      <Typography variant='caption' sx={{ color: (t) => t.palette.textExtra.tertiary }}>
        {FINAL_CTA_CONTENT.caption}
      </Typography>
    </Stack>
  </Section>
)
