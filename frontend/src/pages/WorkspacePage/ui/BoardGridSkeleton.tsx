import { Card, CardContent, Grid, Skeleton, Stack } from '@mui/material'

const SKELETON_COUNT = 4

export const BoardGridSkeleton = () => {
  return (
    <Grid container spacing={2.5}>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant='outlined' sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Skeleton variant='text' width='60%' height={28} />
                <Skeleton variant='text' width='100%' />
                <Skeleton variant='text' width='80%' />
                <Skeleton variant='rounded' width={80} height={20} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
