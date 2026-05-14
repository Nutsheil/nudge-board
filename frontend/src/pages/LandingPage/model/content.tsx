import Checklist from '@mui/icons-material/Checklist'
import Dashboard from '@mui/icons-material/Dashboard'
import RocketLaunch from '@mui/icons-material/RocketLaunch'
import Timer from '@mui/icons-material/Timer'
import ViewKanban from '@mui/icons-material/ViewKanban'
import WifiOff from '@mui/icons-material/WifiOff'
import type { ReactNode } from 'react'

export type FeatureMeta = {
  id: 'boards' | 'tracking' | 'offline'
  icon: ReactNode
  reverse?: boolean
}

export const FEATURES: FeatureMeta[] = [
  { id: 'boards', icon: <ViewKanban /> },
  { id: 'tracking', icon: <Timer />, reverse: true },
  { id: 'offline', icon: <WifiOff /> },
]

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
  { name: 'WebSockets', dot: '#a855f7' },
  { name: 'PWA', dot: '#5bb974' },
]

export const SOURCE_REPO_URL = 'https://github.com/Nutsheil/nudge-board'
