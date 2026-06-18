import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Paper, Stack, TextField } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useCreateTaskMutation } from '@/entities/task'
import { getErrorKey } from '@/shared/api/errors'

interface Props {
  workspaceId: string
  boardId: string
  columnId: string
}

export const CreateTaskInline = ({ workspaceId, boardId, columnId }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation(['task', 'errors'])
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')

  const reset = () => {
    setEditing(false)
    setTitle('')
  }

  const submit = async () => {
    const trimmed = title.trim()
    if (!trimmed) {
      reset()
      return
    }
    try {
      await createTask({ workspaceId, boardId, columnId, title: trimmed }).unwrap()
      reset()
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.task.createFailed' })), { variant: 'error' })
    }
  }

  if (!editing) {
    return (
      <Box>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setEditing(true)}
          fullWidth
          size='small'
          color='inherit'
          sx={{
            justifyContent: 'flex-start',
            color: 'text.secondary',
            '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
          }}
        >
          {t('task.add.trigger')}
        </Button>
      </Box>
    )
  }

  return (
    <Paper variant='outlined' sx={{ p: 1 }}>
      <TextField
        autoFocus
        fullWidth
        multiline
        size='small'
        value={title}
        placeholder={t('task.add.placeholder')}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            void submit()
          }
          if (e.key === 'Escape') reset()
        }}
        slotProps={{ htmlInput: { maxLength: 200 } }}
      />
      <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
        <Button size='small' variant='contained' onClick={() => void submit()} disabled={isLoading}>
          {t('task.add.submit')}
        </Button>
        <Button size='small' onClick={reset} disabled={isLoading}>
          {t('task.add.cancel')}
        </Button>
      </Stack>
    </Paper>
  )
}
