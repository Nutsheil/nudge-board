import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Paper, Stack, TextField } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useCreateColumnMutation } from '@/entities/column'
import { getErrorKey } from '@/shared/api/errors'

interface Props {
  workspaceId: string
  boardId: string
}

export const CreateColumnInline = ({ workspaceId, boardId }: Props) => {
  const [createColumn, { isLoading }] = useCreateColumnMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation(['column', 'errors'])
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')

  const reset = () => {
    setEditing(false)
    setName('')
  }

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      reset()
      return
    }
    try {
      await createColumn({ workspaceId, boardId, name: trimmed }).unwrap()
      reset()
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.column.createFailed' })), { variant: 'error' })
    }
  }

  if (!editing) {
    return (
      <Box sx={{ width: 288, flexShrink: 0 }}>
        <Button startIcon={<AddIcon />} onClick={() => setEditing(true)} fullWidth sx={{ justifyContent: 'flex-start' }}>
          {t('column.add.trigger')}
        </Button>
      </Box>
    )
  }

  return (
    <Paper variant='outlined' sx={{ width: 288, flexShrink: 0, p: 1.5 }}>
      <TextField
        autoFocus
        fullWidth
        size='small'
        value={name}
        placeholder={t('column.add.placeholder')}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') void submit()
          if (e.key === 'Escape') reset()
        }}
        slotProps={{ htmlInput: { maxLength: 64 } }}
      />
      <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
        <Button size='small' variant='contained' onClick={() => void submit()} disabled={isLoading}>
          {t('column.add.submit')}
        </Button>
        <Button size='small' onClick={reset} disabled={isLoading}>
          {t('column.add.cancel')}
        </Button>
      </Stack>
    </Paper>
  )
}
