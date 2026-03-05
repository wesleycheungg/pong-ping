import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Rankings from '../components/Rankings';

const mockPlayers = [
  { id: '1', name: 'Alice', elo: 1200, wins: 10, losses: 3 },
  { id: '2', name: 'Bob',   elo: 950,  wins: 5,  losses: 5 },
  { id: '3', name: 'Carol', elo: 1450, wins: 20, losses: 2 },
];

describe('Rankings', () => {
  it('renders empty state when no players', () => {
    render(<Rankings players={[]} />);
    expect(screen.getByText(/no players yet/i)).toBeInTheDocument();
  });

  it('renders all players', () => {
    render(<Rankings players={mockPlayers} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
  });

  it('sorts players by elo descending', () => {
    render(<Rankings players={mockPlayers} />);
    const names = screen.getAllByText(/Alice|Bob|Carol/).map(el => el.textContent);
    expect(names[0]).toBe('Carol'); // 1450
    expect(names[1]).toBe('Alice'); // 1200
    expect(names[2]).toBe('Bob');   // 950
  });

  it('shows crown emoji for top player', () => {
    render(<Rankings players={mockPlayers} />);
    expect(screen.getByText('👑')).toBeInTheDocument();
  });

  it('shows correct elo for each player', () => {
    render(<Rankings players={mockPlayers} />);
    expect(screen.getByText('1450')).toBeInTheDocument();
    expect(screen.getByText('1200')).toBeInTheDocument();
    expect(screen.getByText('950')).toBeInTheDocument();
  });

  it('shows correct win/loss record', () => {
    render(<Rankings players={mockPlayers} />);
    expect(screen.getByText(/20W 2L/)).toBeInTheDocument();
  });

  it('shows correct rank label', () => {
    render(<Rankings players={mockPlayers} />);
    expect(screen.getByText('GRAND MASTER')).toBeInTheDocument();
    expect(screen.getByText('EXPERT')).toBeInTheDocument();
    expect(screen.getByText('PLAYER')).toBeInTheDocument();
  });

  it('shows correct win rate', () => {
    render(<Rankings players={mockPlayers} />);
    // Bob: 5W 5L = 50%
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it('shows 0% win rate for player with no games', () => {
    const newPlayer = [{ id: '4', name: 'Dave', elo: 1000, wins: 0, losses: 0 }];
    render(<Rankings players={newPlayer} />);
    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });
});
