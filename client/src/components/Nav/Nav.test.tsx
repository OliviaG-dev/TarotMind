import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Nav from './Nav'

function renderNav(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Nav />
    </MemoryRouter>,
  )
}

describe('Nav', () => {
  it('renders primary navigation links', () => {
    renderNav()

    expect(screen.getByRole('link', { name: /Accueil/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /Tirage/i })).toHaveAttribute('href', '/tirage')
    expect(screen.getByRole('link', { name: /Historique/i })).toHaveAttribute('href', '/historique')
  })

  it('toggles mobile menu visibility', async () => {
    const user = userEvent.setup()
    const { container } = renderNav()

    const toggle = within(container).getByRole('button', { name: /Ouvrir le menu/i })
    const links = within(container).getByRole('navigation').querySelector('#main-nav-links')

    expect(links).not.toHaveClass('nav__links--open')

    await user.click(toggle)
    expect(links).toHaveClass('nav__links--open')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })
})
