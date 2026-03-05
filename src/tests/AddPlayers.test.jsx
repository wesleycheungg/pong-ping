import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddPlayers from '../components/AddPlayers';

const mockPlayers = [
  { id: '1', name: 'Alice', elo: 1000, wins: 5, losses: 3 },
  { id: '2', name: 'Bob',   elo: 1200, wins: 8, losses: 2 },
];

describe('AddPlayers', () => {
  it('renders the input and add button', () => {
    render(<AddPlayers players={[]} onAdd={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByPlaceholderText(/player name/i)).toBeInTheDocument();
    expect(screen.getByText('ADD')).toBeInTheDocument();
  });

  it('calls onAdd with trimmed name when ADD is clicked', () => {
    const onAdd = vi.fn();
    render(<AddPlayers players={[]} onAdd={onAdd} onDelete={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/player name/i), { target: { value: '  Wesley  ' } });
    fireEvent.click(screen.getByText('ADD'));
    expect(onAdd).toHaveBeenCalledWith('Wesley');
  });

  it('calls onAdd when Enter key is pressed', () => {
    const onAdd = vi.fn();
    render(<AddPlayers players={[]} onAdd={onAdd} onDelete={vi.fn()} />);
    const input = screen.getByPlaceholderText(/player name/i);
    fireEvent.change(input, { target: { value: 'Wesley' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAdd).toHaveBeenCalledWith('Wesley');
  });

  it('does not call onAdd when input is empty', () => {
    const onAdd = vi.fn();
    render(<AddPlayers players={[]} onAdd={onAdd} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByText('ADD'));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('clears input after adding', () => {
    render(<AddPlayers players={[]} onAdd={vi.fn()} onDelete={vi.fn()} />);
    const input = screen.getByPlaceholderText(/player name/i);
    fireEvent.change(input, { target: { value: 'Wesley' } });
    fireEvent.click(screen.getByText('ADD'));
    expect(input.value).toBe('');
  });

  it('renders existing players', () => {
    render(<AddPlayers players={mockPlayers} onAdd={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows win/loss and elo for each player', () => {
    render(<AddPlayers players={mockPlayers} onAdd={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/5W 3L · 1000 ELO/)).toBeInTheDocument();
  });

  it('calls onDelete when × is clicked', () => {
    const onDelete = vi.fn();
    render(<AddPlayers players={mockPlayers} onAdd={vi.fn()} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByText('×');
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith(mockPlayers[0]);
  });

  it('does not show player list when no players exist', () => {
    render(<AddPlayers players={[]} onAdd={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText('CURRENT PLAYERS')).not.toBeInTheDocument();
  });
});
