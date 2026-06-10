import { Box } from '@mui/material'

type BarProps = {
  w?: number | string
  h?: number
  color?: string
}

export const Bar = ({ w = '100%', h = 6, color = 'text.disabled' }: BarProps) => (
  <Box sx={{ width: w, height: h, borderRadius: 999, bgcolor: color, flexShrink: 0 }} />
)
