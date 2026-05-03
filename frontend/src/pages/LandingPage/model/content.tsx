import Checklist from '@mui/icons-material/Checklist'
import Dashboard from '@mui/icons-material/Dashboard'
import RocketLaunch from '@mui/icons-material/RocketLaunch'
import Timer from '@mui/icons-material/Timer'
import ViewKanban from '@mui/icons-material/ViewKanban'
import WifiOff from '@mui/icons-material/WifiOff'
import type { ReactNode } from 'react'

export const HERO_CONTENT = {
  title: 'Stop Juggling Tasks. Start Shipping.',
  description:
    'NudgeBoard is the Kanban-first task tracker for solo developers and small teams who just want to get things done.',
  primaryCta: 'Get Started — Free',
  secondaryCta: 'View Demo Board',
  mockupLabel: 'Kanban Board Screenshot',
}

export const FEATURES_HEADING = {
  title: "Everything You Need, Nothing You Don't",
  subtitle: 'All the tools your team needs to stay organized, track progress, and deliver faster.',
}

export type Feature = {
  tag: string
  title: string
  description: string
  icon: ReactNode
  mockupLabel: string
  reverse?: boolean
}

export const FEATURES: Feature[] = [
  {
    tag: 'BOARDS',
    title: 'Visual task management that just works',
    description:
      'Drag-and-drop Kanban with customizable columns, labels, and priorities. See your whole project at a glance.',
    icon: <ViewKanban />,
    mockupLabel: 'Kanban Board Screenshot',
  },
  {
    tag: 'TRACKING',
    title: 'Know exactly where your time goes',
    description:
      'Built-in time tracking per task. Start a timer, log hours manually, and export reports without leaving the board.',
    icon: <Timer />,
    mockupLabel: 'Time Tracking Screenshot',
    reverse: true,
  },
  {
    tag: 'OFFLINE',
    title: 'Works anywhere, even without internet',
    description: 'Install as a PWA and keep working offline. Changes sync automatically when you reconnect.',
    icon: <WifiOff />,
    mockupLabel: 'PWA / Offline Screenshot',
  },
]

export const HOW_IT_WORKS_HEADING = {
  title: 'Get from zero to shipped in three steps',
  subtitle: 'No complex setup. No steep learning curve. Just a clear path from idea to done.',
}

export type Step = { num: string; icon: ReactNode; title: string; description: string }

export const STEPS: Step[] = [
  {
    num: '01',
    icon: <Dashboard />,
    title: 'Create a board',
    description: "Set up your project board in seconds. Name it, pick a color, and you're ready to go.",
  },
  {
    num: '02',
    icon: <Checklist />,
    title: 'Add tasks',
    description: 'Create cards, assign priorities, set due dates, and drag them across columns as work progresses.',
  },
  {
    num: '03',
    icon: <RocketLaunch />,
    title: 'Track & ship',
    description: 'Use built-in time tracking and progress views to stay on schedule. Ship with confidence.',
  },
]

export const STACK_HEADING = {
  title: 'Built with tools you already know',
  subtitle: 'A modern, production-ready stack — no bloat, no surprises.',
}

export const TECH_TAGS: { name: string; dot: string }[] = [
  { name: 'React', dot: '#61dafb' },
  { name: 'NestJS', dot: '#e0234e' },
  { name: 'PostgreSQL', dot: '#336791' },
  { name: 'WebSockets', dot: '#a855f7' },
  { name: 'PWA', dot: '#5bb974' },
]

export const SOURCE_REPO_URL = 'https://github.com/Nutsheil/nudge-board'
export const SOURCE_REPO_LABEL = 'View source on GitHub'

export const FINAL_CTA_CONTENT = {
  title: 'Ready to take control of your tasks?',
  subtitle: 'Join developers and teams who replaced chaos with clarity.',
  cta: 'Create Free Account',
  caption: 'No credit card required · Cancel anytime',
}
