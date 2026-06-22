import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SPREADS } from '../../data/spreads'
import { MAJOR_ARCANA, MINOR_ARCANA } from '../../data/tarotDeck'
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

  it('groups card options by suit with color classes', () => {
    const batons = MINOR_ARCANA.filter((c) => c.id.startsWith('minor-batons-')).slice(0, 2)
    const coupes = MINOR_ARCANA.filter((c) => c.id.startsWith('minor-coupes-')).slice(0, 2)

    render(
      <SpreadSchema
        spreadId="one"
        spread={oneCardSpread}
        deckCards={[...MAJOR_ARCANA.slice(0, 2), ...batons, ...coupes]}
        slots={{ focus: { cardId: null, reversed: false } }}
        onSlotChange={vi.fn()}
      />,
    )

    const select = screen.getByLabelText(/Carte pour Message du moment/i)
    expect(select.querySelector('option.spread-schema__select-group--major')).toBeTruthy()
    expect(select.querySelector('option.spread-schema__select-option--major')).toBeTruthy()
    expect(select.querySelector('option.spread-schema__select-group--batons')).toBeTruthy()
    expect(select.querySelector('option.spread-schema__select-option--batons')).toBeTruthy()
    expect(select.querySelector('option.spread-schema__select-group--coupes')).toBeTruthy()
    expect(select.querySelector('option.spread-schema__select-option--coupes')).toBeTruthy()
  })

  it('applies suit color class to the card face when a card is selected', () => {
    const { container } = render(
      <SpreadSchema
        spreadId="one"
        spread={oneCardSpread}
        deckCards={MAJOR_ARCANA.slice(0, 3)}
        slots={{ focus: { cardId: '0', reversed: false } }}
        onSlotChange={vi.fn()}
      />,
    )

    expect(container.querySelector('.spread-schema__face--major')).toBeTruthy()
  })
})
