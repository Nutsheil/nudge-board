import AddIcon from '@mui/icons-material/Add'
import { Card, CardActionArea, Stack, Typography } from '@mui/material'

interface Props {
  onClick: () => void
}

export const CreateWorkspaceCard = ({ onClick }: Props) => {
  return (
    <Card
      variant='outlined'
      sx={{
        height: '100%',
        borderStyle: 'dashed',
        bgcolor: 'transparent',
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: '100%',
          minHeight: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}>
          <AddIcon fontSize='large' />
          <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
            Создать пространство
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  )
}
