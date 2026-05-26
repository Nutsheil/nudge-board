import { Box, Button, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface Props {
  onButtonCreateClick: () => void
}

export const NoWorkspaces = ({ onButtonCreateClick }: Props) => {
  const { t } = useTranslation('workspace')

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
        <Typography variant='h6'>{t('workspace.list.empty.title')}</Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          {t('workspace.list.empty.subtitle')}
        </Typography>
        <Button variant='contained' onClick={onButtonCreateClick}>
          {t('workspace.list.create')}
        </Button>
      </Stack>
    </Box>
  )
}
