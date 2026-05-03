import GitHub from '@mui/icons-material/GitHub'
import NorthEast from '@mui/icons-material/NorthEast'
import { Box, Stack, Typography } from '@mui/material'

import { SOURCE_REPO_LABEL, SOURCE_REPO_URL, STACK_HEADING, TECH_TAGS } from '../model/content'
import { Section } from './Section'
import { SectionHeading } from './SectionHeading'

export const StackSection = () => (
  <Section dense spacing={4} sx={{ alignItems: 'center' }}>
    <SectionHeading title={STACK_HEADING.title} subtitle={STACK_HEADING.subtitle} />

    <Box sx={{ justifyContent: 'center', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {TECH_TAGS.map((tag) => (
        <Stack
          key={tag.name}
          direction='row'
          spacing={1}
          sx={{
            bgcolor: (t) => t.palette.surface.pill,
            borderRadius: 2,
            px: 2.5,
            py: 1.25,
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tag.dot }} />
          <Typography variant='subtitle2'>{tag.name}</Typography>
        </Stack>
      ))}
    </Box>

    <Stack
      component='a'
      href={SOURCE_REPO_URL}
      target='_blank'
      rel='noopener noreferrer'
      direction='row'
      spacing={1}
      sx={{
        bgcolor: (t) => t.palette.surface.pill,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        px: 2.5,
        py: 1.25,
        textDecoration: 'none',
        alignItems: 'center',
        transition: (t) => t.transitions.create('background-color'),
        '&:hover': { bgcolor: (t) => t.palette.surface.pillHover },
      }}
    >
      <GitHub fontSize='small' sx={{ color: 'text.primary' }} />
      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
        {SOURCE_REPO_LABEL}
      </Typography>
      <NorthEast sx={{ fontSize: 14, color: 'primary.main' }} />
    </Stack>
  </Section>
)
