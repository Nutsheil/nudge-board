import { Stack, type StackProps } from '@mui/material'

import { useInView } from '@/shared/lib'

type SectionProps = StackProps & {
  dense?: boolean
  disableReveal?: boolean
}

export const Section = ({ dense, disableReveal, sx, ...rest }: SectionProps) => {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px', threshold: 0.1 })
  const reveal = !disableReveal
  const visible = !reveal || inView

  return (
    <Stack
      component='section'
      ref={reveal ? ref : undefined}
      spacing={{ xs: 4, md: 8 }}
      {...rest}
      sx={[
        {
          px: { xs: 3, md: 10 },
          py: dense ? { xs: 6, md: 10 } : { xs: 8, md: 12.5 },
          ...(reveal && {
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: (theme) =>
              theme.transitions.create(['opacity', 'transform'], {
                duration: 600,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }),
            '@media (prefers-reduced-motion: reduce)': {
              opacity: 1,
              transform: 'none',
              transition: 'none',
            },
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  )
}
