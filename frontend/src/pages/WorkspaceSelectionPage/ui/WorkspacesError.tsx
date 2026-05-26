import { Alert, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface Props {
  onRefreshClick: () => void
}

export const WorkspacesError = ({ onRefreshClick }: Props) => {
  const { t } = useTranslation('workspace')

  return (
    <Alert
      severity='error'
      action={
        <Button color='inherit' size='small' onClick={onRefreshClick}>
          {t('workspace.list.retry')}
        </Button>
      }
    >
      {t('workspace.list.loadError')}
    </Alert>
  )
}
