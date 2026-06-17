import { Box, Button, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface Props {
  onCreateClick: () => void
}

export const NoBoards = ({ onCreateClick }: Props) => {
  const { t } = useTranslation('board')

  return (
    <Box
      sx={{
        border: 1,
        borderStyle: 'dashed',
        borderColor: 'divider',
        borderRadius: 2,
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant='h6'>{t('board.list.empty.title')}</Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          {t('board.list.empty.subtitle')}
        </Typography>
        <Button variant='contained' onClick={onCreateClick}>
          {t('board.list.create')}
        </Button>
      </Stack>
    </Box>
  )
}
