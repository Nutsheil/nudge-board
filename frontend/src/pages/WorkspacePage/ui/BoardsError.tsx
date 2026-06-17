import { Alert, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface Props {
  onRetryClick: () => void
}

export const BoardsError = ({ onRetryClick }: Props) => {
  const { t } = useTranslation('board')

  return (
    <Alert
      severity='error'
      action={
        <Button color='inherit' size='small' onClick={onRetryClick}>
          {t('board.list.retry')}
        </Button>
      }
    >
      {t('board.list.loadError')}
    </Alert>
  )
}
