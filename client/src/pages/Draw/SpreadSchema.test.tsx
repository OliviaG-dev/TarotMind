import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SPREADS } from '../../data/spreads'
import { MAJOR_ARCANA } from '../../data/tarotDeck'
import { SpreadSchema } from './SpreadSchema'

const oneCardSpread = SPREADS.find((spread) => spread.id === 'one')!

describe('SpreadSchema', () => {
  it('renders a single-card spread and notifies slot changes', async () => {
    const user = userEvent.setup()
    const onSlotChange = vi.fn()
    const deckCards = MAJOR_ARCANA.slice(0, 3)

    render(
      <SpreadSchema
        spreadId="one"
        spread={oneCardSpread}
        deckCards={deckCards}
        slots={{ focus: { cardId: null, reversed: false } }}
        onSlotChange={onSlotChange}
      />,
    )

    expect(screen.getByText(/Tire ta carte physiquement/i)).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText(/Carte pour Message du moment/i), '0')
    expect(onSlotChange).toHaveBeenCalledWith('focus', {
      cardId: '0',
      reversed: false,
    })
  })
})
