import { render, screen } from '@testing-library/react';
import React from 'react';
import SessionPlayerList from '../components/SessionPlayerList';
import '@testing-library/jest-dom/extend-expect';

describe('Leaderboard', () => {
  it('Check null case', () => {
    render(
      <SessionPlayerList sessionPlayers={null}/>
    );
    expect(screen.getByText(/No current players/i)).toBeInTheDocument();
  });

  it('Check empty case (no results)', () => {
    render(
      <SessionPlayerList sessionPlayers={[]}/>
    );
    expect(screen.getByText(/No current players/i)).toBeInTheDocument();
  });

  it('Check 1 entry', () => {
    const testData = [
      'Steve'
    ]
    render(
      <SessionPlayerList sessionPlayers={testData}/>
    );
    expect(screen.queryByText(/Leaderboard is empty/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Steve/i)).toBeInTheDocument();
  });

  it('Check multiple entries', () => {
    const testData = [
      'Jason',
      'Steve',
      'Bella'
    ]
    render(
      <SessionPlayerList sessionPlayers={testData}/>
    );
    expect(screen.queryByText(/Jason/i)).toBeInTheDocument();
    expect(screen.queryByText(/Steve/i)).toBeInTheDocument();
    expect(screen.queryByText(/Bella/i)).toBeInTheDocument();
  });
});
