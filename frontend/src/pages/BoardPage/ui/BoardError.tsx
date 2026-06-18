import { Alert, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface Props {
  onRetryClick: () => void
}

export const BoardError = ({ onRetryClick }: Props) => {
  const { t } = useTranslation('column')

  return (
    <Alert
      severity='error'
      action={
        <Button color='inherit' size='small' onClick={onRetryClick}>
          {t('column.board.retry')}
        </Button>
      }
    >
      {t('column.board.loadError')}
    </Alert>
  )
}
