import Checklist from '@mui/icons-material/Checklist'
import Dashboard from '@mui/icons-material/Dashboard'
import RocketLaunch from '@mui/icons-material/RocketLaunch'
import type { ReactNode } from 'react'

export type FeatureMeta = {
  id: 'boards' | 'tracking' | 'offline'
  reverse?: boolean
}

export const FEATURES: FeatureMeta[] = [{ id: 'boards' }, { id: 'tracking', reverse: true }, { id: 'offline' }]

export type StepMeta = { id: 'create' | 'add' | 'track'; num: string; icon: ReactNode }

export const STEPS: StepMeta[] = [
  { id: 'create', num: '01', icon: <Dashboard /> },
  { id: 'add', num: '02', icon: <Checklist /> },
  { id: 'track', num: '03', icon: <RocketLaunch /> },
]

export const TECH_TAGS: { name: string; dot: string }[] = [
  { name: 'React', dot: '#61dafb' },
  { name: 'NestJS', dot: '#e0234e' },
  { name: 'PostgreSQL', dot: '#336791' },
  { name: 'WebSockets', dot: '#0d9488' },
  { name: 'PWA', dot: '#5bb974' },
]

export const SOURCE_REPO_URL = 'https://github.com/Nutsheil/nudge-board'
