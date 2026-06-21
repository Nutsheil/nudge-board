import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useMemo, useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import {
  LABEL_COLORS,
  LABEL_HEX,
  labelChipSx,
  type Label,
  type LabelColor,
  useCreateLabelMutation,
  useDeleteLabelMutation,
  useGetLabelsQuery,
  useUpdateLabelMutation,
} from '@/entities/label'
import { getErrorKey } from '@/shared/api/errors'

interface Props {
  workspaceId: string
  selectedIds: string[]
  onChange: (next: string[]) => void
}

const Swatches = ({ value, onPick }: { value: LabelColor; onPick: (c: LabelColor) => void }) => (
  <Stack direction='row' spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
    {LABEL_COLORS.map((c) => (
      <Box
        key={c}
        role='button'
        aria-label={c}
        onClick={() => onPick(c)}
        sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          cursor: 'pointer',
          bgcolor: LABEL_HEX[c],
          outline: value === c ? '2px solid' : 'none',
          outlineColor: 'text.primary',
          outlineOffset: 2,
        }}
      />
    ))}
  </Stack>
)

export const LabelPicker = ({ workspaceId, selectedIds, onChange }: Props) => {
  const { t } = useTranslation(['label', 'errors'])
  const { enqueueSnackbar } = useSnackbar()
  const { data: labels = [] } = useGetLabelsQuery(workspaceId)
  const [createLabel] = useCreateLabelMutation()
  const [updateLabel] = useUpdateLabelMutation()
  const [deleteLabel] = useDeleteLabelMutation()

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [query, setQuery] = useState('')
  const [draftColor, setDraftColor] = useState<LabelColor>('SLATE')
  const [editing, setEditing] = useState<Label | null>(null)

  const open = Boolean(anchorEl)
  const close = () => {
    setAnchorEl(null)
    setQuery('')
    setEditing(null)
    setDraftColor('SLATE')
  }

  const filtered = useMemo(
    () => labels.filter((l) => l.name.toLowerCase().includes(query.trim().toLowerCase())),
    [labels, query],
  )
  const exactMatch = labels.some((l) => l.name.toLowerCase() === query.trim().toLowerCase())
  const canCreate = query.trim().length > 0 && !exactMatch

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])
  }

  const handleCreate = async () => {
    const name = query.trim()
    if (!name) return
    try {
      const created = await createLabel({ workspaceId, name, color: draftColor }).unwrap()
      onChange([...selectedIds, created.id])
      setQuery('')
      setDraftColor('SLATE')
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.label.createFailed' })), { variant: 'error' })
    }
  }

  const handleSaveEdit = async () => {
    if (!editing) return
    try {
      await updateLabel({
        workspaceId,
        labelId: editing.id,
        patch: { name: editing.name.trim(), color: editing.color },
      }).unwrap()
      setEditing(null)
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.label.updateFailed' })), { variant: 'error' })
    }
  }

  const handleDelete = async (label: Label) => {
    if (!window.confirm(t('label.picker.deleteConfirm', { name: label.name }))) return
    try {
      await deleteLabel({ workspaceId, labelId: label.id }).unwrap()
      onChange(selectedIds.filter((x) => x !== label.id))
    } catch (err) {
      enqueueSnackbar(t(getErrorKey(err, { fallback: 'errors.label.deleteFailed' })), { variant: 'error' })
    }
  }

  const openPicker = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)

  return (
    <Box>
      <Stack direction='row' spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
        {selectedIds.map((id) => {
          const l = labels.find((x) => x.id === id)
          if (!l) return null
          return <Chip key={id} size='small' label={l.name} sx={labelChipSx(l.color)} />
        })}
        <Button size='small' startIcon={<LabelOutlinedIcon />} onClick={openPicker} sx={{ color: 'text.secondary' }}>
          {t('label.picker.trigger')}
        </Button>
      </Stack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: 300, p: 1.5 } } }}
      >
        <Stack spacing={1}>
          <Typography variant='subtitle2'>{t('label.picker.title')}</Typography>
          <TextField
            size='small'
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('label.picker.search')}
            fullWidth
            disabled={editing !== null}
          />
          {canCreate && (
            <Stack spacing={0.5}>
              <Swatches value={draftColor} onPick={setDraftColor} />
              <Button size='small' startIcon={<AddIcon />} onClick={handleCreate} sx={{ justifyContent: 'flex-start' }}>
                {t('label.picker.create', { name: query.trim() })}
              </Button>
            </Stack>
          )}
          <List dense disablePadding sx={{ maxHeight: 260, overflowY: 'auto' }}>
            {filtered.length === 0 && !canCreate && (
              <Typography variant='body2' sx={{ color: 'text.secondary', px: 1, py: 0.5 }}>
                {labels.length === 0 ? t('label.picker.empty') : t('label.picker.noMatches')}
              </Typography>
            )}
            {filtered.map((l) =>
              editing?.id === l.id ? (
                <ListItem key={l.id} disableGutters sx={{ display: 'block', py: 0.5 }}>
                  <Stack spacing={0.5}>
                    <TextField
                      size='small'
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      fullWidth
                    />
                    <Swatches value={editing.color} onPick={(c) => setEditing({ ...editing, color: c })} />
                    <Stack direction='row' spacing={1} sx={{ justifyContent: 'flex-end' }}>
                      <Button size='small' onClick={() => setEditing(null)}>
                        {t('label.picker.cancel')}
                      </Button>
                      <Button size='small' variant='contained' onClick={handleSaveEdit}>
                        {t('label.picker.save')}
                      </Button>
                    </Stack>
                  </Stack>
                </ListItem>
              ) : (
                <ListItem
                  key={l.id}
                  disableGutters
                  secondaryAction={
                    <Stack direction='row'>
                      <Tooltip title={t('label.picker.edit')}>
                        <IconButton size='small' edge='end' onClick={() => setEditing(l)}>
                          <EditIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('label.picker.delete')}>
                        <IconButton size='small' edge='end' onClick={() => handleDelete(l)}>
                          <DeleteOutlineIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                >
                  <ListItemButton dense onClick={() => toggle(l.id)} sx={{ borderRadius: 1 }}>
                    <Checkbox edge='start' size='small' checked={selectedIds.includes(l.id)} tabIndex={-1} disableRipple slotProps={{ input: { 'aria-label': l.name } }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: LABEL_HEX[l.color], mr: 1 }} />
                    <ListItemText primary={l.name} />
                  </ListItemButton>
                </ListItem>
              ),
            )}
          </List>
        </Stack>
      </Popover>
    </Box>
  )
}
