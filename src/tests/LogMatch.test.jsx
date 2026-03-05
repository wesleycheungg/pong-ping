import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LogMatch from '../components/LogMatch';

const mockPlayers = [
  { id: '1', name: 'Alice', elo: 1000, wins: 5, losses: 3 },
  { id: '2', name: 'Bob',   elo: 1200, wins: 8, losses: 2 },
  { id: '3', name: 'Carol', elo: 800,  wins: 2, losses: 6 },
];

describe('LogMatch', () => {
  it('shows message when fewer than 2 players', () => {
    render(<LogMatch players={[mockPlayers[0]]} onSubmit={vi.fn()} />);
    expect(screen.getByText(/add at least 2 players/i)).toBeInTheDocument();
  });

  it('renders winner and loser dropdowns', () => {
    render(<LogMatch players={mockPlayers} onSubmit={vi.fn()} />);
    expect(screen.getByText('WINNER 🏆')).toBeInTheDocument();
    expect(screen.getByText('LOSER 💀')).toBeInTheDocument();
  });

  it('submit button is disabled when no players selected', () => {
    render(<LogMatch players={mockPlayers} onSubmit={vi.fn()} />);
    const btn = screen.getByText('SUBMIT MATCH');
    expect(btn).toBeDisabled();
  });

  it('shows elo preview when both players are selected', () => {
    render(<LogMatch players={mockPlayers} onSubmit={vi.fn()} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Alice' } });
    fireEvent.change(selects[1], { target: { value: 'Bob' } });
    expect(screen.getByText(/preview/i)).toBeInTheDocument();
  });

  it('calls onSubmit with winner and loser names', () => {
    const onSubmit = vi.fn();
    render(<LogMatch players={mockPlayers} onSubmit={onSubmit} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Alice' } });
    fireEvent.change(selects[1], { target: { value: 'Bob' } });
    fireEvent.click(screen.getByText('SUBMIT MATCH'));
    expect(onSubmit).toHaveBeenCalledWith('Alice', 'Bob');
  });

  it('resets dropdowns after submitting', () => {
    const onSubmit = vi.fn();
    render(<LogMatch players={mockPlayers} onSubmit={onSubmit} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Alice' } });
    fireEvent.change(selects[1], { target: { value: 'Bob' } });
    fireEvent.click(screen.getByText('SUBMIT MATCH'));
    expect(selects[0].value).toBe('');
    expect(selects[1].value).toBe('');
  });

  it('does not call onSubmit when only winner is selected', () => {
    const onSubmit = vi.fn();
    render(<LogMatch players={mockPlayers} onSubmit={onSubmit} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Alice' } });
    fireEvent.click(screen.getByText('SUBMIT MATCH'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('selected winner does not appear in loser dropdown', () => {
    render(<LogMatch players={mockPlayers} onSubmit={vi.fn()} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Alice' } });
    const loserOptions = Array.from(selects[1].options).map(o => o.value);
    expect(loserOptions).not.toContain('Alice');
  });
});
