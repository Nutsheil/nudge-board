import { Box, Container } from '@mui/material'

import { FeaturesSection, FinalCtaSection, HeroSection, HowItWorksSection, StackSection } from './ui'

const LandingPage = () => {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Container maxWidth='xl' disableGutters>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StackSection />
        <FinalCtaSection />
      </Container>
    </Box>
  )
}

export default LandingPage
