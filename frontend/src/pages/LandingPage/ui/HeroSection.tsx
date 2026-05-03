import Dashboard from '@mui/icons-material/Dashboard'
import PlayArrow from '@mui/icons-material/PlayArrow'
import { Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'

import { ROUTES } from '@/shared/config'
import { BrowserMockup } from '@/shared/ui'

import { HERO_CONTENT } from '../model/content'
import { Section } from './Section'

export const HeroSection = () => (
  <Section
    dense
    disableReveal
    direction={{ xs: 'column', md: 'row' }}
    spacing={{ xs: 6, md: 7.5 }}
    sx={{ alignItems: 'center' }}
  >
    <Stack spacing={3.5} sx={{ width: '100%', flex: 1 }}>
      <Typography variant='h1'>{HERO_CONTENT.title}</Typography>

      <Typography variant='subtitle1' sx={{ color: 'text.secondary' }}>
        {HERO_CONTENT.description}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button component={Link} to={ROUTES.auth} variant='contained' size='extraLarge'>
          {HERO_CONTENT.primaryCta}
        </Button>
        <Button variant='outlined' color='inherit' size='extraLarge' endIcon={<PlayArrow />}>
          {HERO_CONTENT.secondaryCta}
        </Button>
      </Stack>
    </Stack>

    <BrowserMockup icon={<Dashboard />} label={HERO_CONTENT.mockupLabel} />
  </Section>
)
