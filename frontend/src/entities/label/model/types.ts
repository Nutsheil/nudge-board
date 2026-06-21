export const LABEL_COLORS = [
  'SLATE',
  'RED',
  'ORANGE',
  'AMBER',
  'GREEN',
  'TEAL',
  'BLUE',
  'INDIGO',
  'PURPLE',
  'PINK',
] as const

export type LabelColor = (typeof LABEL_COLORS)[number]

export interface Label {
  id: string
  name: string
  color: LabelColor
}
