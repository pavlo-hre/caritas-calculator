import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ServiceCalculator from './components/ServiceCalculator'

// WordPress entry: mounts the calculator into every placeholder printed by the [caritas_calculator] shortcode.
// Page-level styles (index.css) are left out on purpose — the WP theme owns the page.
document.querySelectorAll<HTMLElement>('.caritas-calculator-root').forEach((el) => {
  createRoot(el).render(
    <StrictMode>
      <ServiceCalculator />
    </StrictMode>,
  )
})
