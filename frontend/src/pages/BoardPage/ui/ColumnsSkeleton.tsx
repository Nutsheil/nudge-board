import { Skeleton, Stack } from '@mui/material'

export const ColumnsSkeleton = () => (
  <Stack direction='row' spacing={2}>
    {[0, 1, 2].map((i) => (
      <Skeleton key={i} variant='rounded' width={288} height={180} sx={{ flexShrink: 0 }} />
    ))}
  </Stack>
)
