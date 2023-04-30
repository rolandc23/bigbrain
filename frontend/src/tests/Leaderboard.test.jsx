import { render, screen } from '@testing-library/react';
import React from 'react';
import Leaderboard from '../components/Leaderboard';
import '@testing-library/jest-dom/extend-expect';

describe('Leaderboard', () => {
  it('Check empty case (no results)', () => {
    render(
      <Leaderboard topPlayers={null}/>
    );
    expect(screen.getByText(/Leaderboard is empty/i)).toBeInTheDocument();
  });

  it('Check 1 entry', () => {
    const testData = [
      {
        name: 'test name',
        points: 1000,
      }
    ]
    render(
      <Leaderboard topPlayers={testData}/>
    );
    expect(screen.queryByText(/Leaderboard is empty/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/test name/i)).toBeInTheDocument();
    expect(screen.queryByText(/1000/i)).toBeInTheDocument();
  });

  it('Check multiple entries', () => {
    // The data for topPlayers will already be extracted to the top 5 and sorted in descent by highest points
    const testData = [
      {
        name: 'test name 1',
        points: 3000,
      },
      {
        name: 'test name 2',
        points: 2000,
      },
      {
        name: 'test name 3',
        points: 1000,
      }
    ]
    render(
      <Leaderboard topPlayers={testData}/>
    );
    expect(screen.queryByText(/test name 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/test name 2/i)).toBeInTheDocument();
    expect(screen.queryByText(/test name 3/i)).toBeInTheDocument();
    expect(screen.queryByText(/1000/i)).toBeInTheDocument();
    expect(screen.queryByText(/2000/i)).toBeInTheDocument();
    expect(screen.queryByText(/3000/i)).toBeInTheDocument();
  });
});
