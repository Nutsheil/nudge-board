import { Stack, Typography } from '@mui/material'

type Props = {
  title: string
  subtitle?: string
}

export const SectionHeading = ({ title, subtitle }: Props) => (
  <Stack spacing={2} sx={{ textAlign: 'center' }}>
    <Typography variant='h3'>{title}</Typography>
    {subtitle && (
      <Typography variant='body1' sx={{ color: 'text.secondary' }}>
        {subtitle}
      </Typography>
    )}
  </Stack>
)
