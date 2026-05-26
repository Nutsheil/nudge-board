import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography, type ChipProps } from '@mui/material'
import { useTranslation } from 'react-i18next'

import type { Workspace, WorkspaceRole } from '../model/types'

const ROLE_COLOR: Record<WorkspaceRole, ChipProps['color']> = {
  OWNER: 'primary',
  ADMIN: 'secondary',
  MEMBER: 'default',
}

interface Props {
  workspace: Workspace
  onClick: () => void
}

export const WorkspaceCard = ({ workspace, onClick }: Props) => {
  const { t } = useTranslation('workspace')

  return (
    <Card variant='outlined' sx={{ height: '100%' }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%', alignItems: 'stretch' }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Stack direction='row' spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant='h6'>{workspace.name}</Typography>
            <Chip
              size='small'
              label={t(`workspace.role.${workspace.role.toLowerCase()}`)}
              color={ROLE_COLOR[workspace.role]}
            />
          </Stack>

          <Typography
            variant='body2'
            sx={{
              color: 'text.secondary',
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {workspace.description ?? t('workspace.card.noDescription')}
          </Typography>

          <Stack direction='row' spacing={2} sx={{ color: 'text.secondary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PeopleOutlinedIcon fontSize='small' />
              <Typography variant='body2'>{workspace.membersCount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DashboardOutlinedIcon fontSize='small' />
              <Typography variant='body2'>{workspace.boardsCount}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
