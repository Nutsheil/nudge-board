import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import type { Priority } from '@/entities/board'
import { useGetMembersQuery } from '@/entities/member'
import {
  type TaskDetail,
  type TaskEditValues,
  type TaskPatch,
  taskEditSchema,
  useGetTaskQuery,
  useSetAssigneesMutation,
  useUpdateTaskMutation,
} from '@/entities/task'
import { getErrorKey } from '@/shared/api/errors'
import { ROUTES } from '@/shared/config'
import { createFormFields, ZodForm } from '@/shared/ui'

const { FormTextField, FormSelect } = createFormFields<TaskEditValues>()
const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

const toFormValues = (task: TaskDetail): TaskEditValues => ({
  title: task.title,
  description: task.description ?? '',
  priority: task.priority,
  dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
  timeEstimate: task.timeEstimate === null ? '' : String(task.timeEstimate),
  timeSpent: String(task.timeSpent),
})

const ViewField = ({ label, children }: { label: string; children: ReactNode }) => (
  <Box>
    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
      {label}
    </Typography>
    <Typography variant='body1' component='div' sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {children}
    </Typography>
  </Box>
)

const TaskPage = () => {
  const { workspaceId = '', boardId = '', taskId = '' } = useParams<{
    workspaceId: string
    boardId: string
    taskId: string
  }>()
  const navigate = useNavigate()
  const { t } = useTranslation(['task', 'errors'])
  const { enqueueSnackbar } = useSnackbar()

  const { data: task, isLoading, isError, refetch } = useGetTaskQuery({ workspaceId, boardId, taskId })
  const { data: members = [] } = useGetMembersQuery(workspaceId)
  const [updateTask] = useUpdateTaskMutation()
  const [setAssignees] = useSetAssigneesMutation()

  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [assigneeIds, setAssigneeIds] = useState<string[]>([])

  const back = () => navigate(ROUTES.board(workspaceId, boardId))

  if (isLoading) {
    return (
      <Container maxWidth='md' sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (isError || !task) {
    return (
      <Container maxWidth='md' sx={{ py: 6 }}>
        <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Typography>{isError ? t('errors.task.loadFailed') : t('task.page.notFound')}</Typography>
          <Button onClick={() => refetch()} variant='outlined'>
            {t('task.page.retry')}
          </Button>
        </Stack>
      </Container>
    )
  }

  const loaded = task

  const startEdit = () => {
    setAssigneeIds(loaded.assignees.map((a) => a.id))
    setMode('edit')
  }

  const handleSave = async (values: TaskEditValues) => {
    const patch: TaskPatch = {}
    const title = values.title.trim()
    if (title !== loaded.title) patch.title = title

    const description = values.description.trim() ? values.description.trim() : null
    if (description !== (loaded.description ?? null)) patch.description = description

    if (values.priority !== loaded.priority) patch.priority = values.priority

    const currentDue = loaded.dueDate ? loaded.dueDate.slice(0, 10) : ''
    if (values.dueDate !== currentDue) {
      patch.dueDate = values.dueDate ? new Date(values.dueDate).toISOString() : null
    }

    const timeEstimate = values.timeEstimate === '' ? null : Number(values.timeEstimate)
    if (timeEstimate !== loaded.timeEstimate) patch.timeEstimate = timeEstimate

    const timeSpent = values.timeSpent === '' ? 0 : Number(values.timeSpent)
    if (timeSpent !== loaded.timeSpent) patch.timeSpent = timeSpent

    const assigneesChanged =
      [...assigneeIds].sort().join(',') !== loaded.assignees.map((a) => a.id).sort().join(',')

    try {
      if (Object.keys(patch).length > 0) {
        await updateTask({ workspaceId, boardId, taskId, patch }).unwrap()
      }
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.task.updateFailed' })), { variant: 'error' })
      return
    }

    try {
      if (assigneesChanged) {
        await setAssignees({ workspaceId, boardId, taskId, userIds: assigneeIds, members }).unwrap()
      }
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.task.assigneesFailed' })), { variant: 'error' })
      return
    }

    setMode('view')
  }

  const backButton = (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={back}
      color='inherit'
      sx={{ alignSelf: 'flex-start', color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
    >
      {t('task.page.back')}
    </Button>
  )

  if (mode === 'view') {
    return (
      <Container maxWidth='md' sx={{ py: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          {backButton}
          <Typography variant='h4' sx={{ wordBreak: 'break-word' }}>
            {loaded.title}
          </Typography>
          <ViewField label={t('task.field.description.label')}>
            {loaded.description || t('task.page.empty')}
          </ViewField>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
            <ViewField label={t('task.field.priority.label')}>{t(`task.priority.${loaded.priority}`)}</ViewField>
            <ViewField label={t('task.field.dueDate.label')}>
              {loaded.dueDate ? new Date(loaded.dueDate).toLocaleDateString() : t('task.page.empty')}
            </ViewField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
            <ViewField label={t('task.field.timeEstimate.label')}>
              {loaded.timeEstimate ?? t('task.page.empty')}
            </ViewField>
            <ViewField label={t('task.field.timeSpent.label')}>{loaded.timeSpent}</ViewField>
          </Stack>
          <ViewField label={t('task.assignees.label')}>
            {loaded.assignees.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {loaded.assignees.map((a) => (
                  <Chip key={a.id} size='small' label={a.name} />
                ))}
              </Box>
            ) : (
              t('task.assignees.empty')
            )}
          </ViewField>
          <Button startIcon={<EditIcon />} variant='contained' onClick={startEdit} sx={{ alignSelf: 'flex-start' }}>
            {t('task.page.edit')}
          </Button>
        </Stack>
      </Container>
    )
  }

  // Edit mode
  return (
    <Container maxWidth='md' sx={{ py: { xs: 3, md: 4 } }}>
      <Stack spacing={3}>
        {backButton}
        <ZodForm schema={taskEditSchema} defaultValues={toFormValues(loaded)} onSubmit={handleSave}>
          <Stack spacing={3}>
            <FormTextField name='title' label={t('task.field.title.label')} fullWidth />
            <FormTextField
              name='description'
              label={t('task.field.description.label')}
              placeholder={t('task.field.description.placeholder')}
              fullWidth
              multiline
              minRows={3}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormSelect
                name='priority'
                label={t('task.field.priority.label')}
                options={PRIORITIES.map((p) => ({ value: p, label: t(`task.priority.${p}`) }))}
                sx={{ minWidth: 180 }}
              />
              <FormTextField
                name='dueDate'
                type='date'
                label={t('task.field.dueDate.label')}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ minWidth: 180 }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormTextField
                name='timeEstimate'
                type='number'
                label={t('task.field.timeEstimate.label')}
                sx={{ minWidth: 180 }}
              />
              <FormTextField
                name='timeSpent'
                type='number'
                label={t('task.field.timeSpent.label')}
                sx={{ minWidth: 180 }}
              />
            </Stack>
            <TextField
              select
              label={t('task.assignees.label')}
              value={assigneeIds}
              onChange={(e) => {
                const value = e.target.value
                setAssigneeIds(typeof value === 'string' ? value.split(',') : (value as unknown as string[]))
              }}
              slotProps={{
                select: {
                  multiple: true,
                  renderValue: (selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((id) => {
                        const m = members.find((x) => x.id === id)
                        return <Chip key={id} size='small' label={m ? m.name : id} />
                      })}
                    </Box>
                  ),
                },
              }}
              fullWidth
            >
              {members.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction='row' spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
              <Button onClick={() => setMode('view')} variant='outlined'>
                {t('task.page.cancel')}
              </Button>
              <Button type='submit' variant='contained'>
                {t('task.page.save')}
              </Button>
            </Stack>
          </Stack>
        </ZodForm>
      </Stack>
    </Container>
  )
}

export default TaskPage
