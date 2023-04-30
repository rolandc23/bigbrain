import { render, screen } from '@testing-library/react';
import React from 'react';
import Aimlab from '../components/Aimlab';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';

describe('Aimlabs', () => {
  it('Check starting state', () => {
    render(
      <Aimlab />
    );
    // Check start button exists
    const startButton = screen.getByText(/Start/i);
    expect(startButton).toBeInTheDocument();
  });

  it('Check instructions button works', async () => {
    render(
      <Aimlab />
    );
    // Check instructions button exists
    const instrButton = screen.getByText(/Show Instructions/i);
    expect(instrButton).toBeInTheDocument();

    // Click instructions button and confirm it shows modal
    await act(async () => {
      userEvent.click(instrButton);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    })
    expect(screen.getByText(/A small, black button will appear on the screen/i)).toBeVisible();

    // Close instructions popup
    const closeBtn = screen.getByTestId('closeInstruction');
    await act(async () => {
      closeBtn.click(instrButton);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    })
    expect(screen.queryByText(/A small, black button will appear on the screen/i)).not.toBeInTheDocument();
  });

  jest.setTimeout(40000);
  it('Check game behaviour', async () => {
    render(
      <Aimlab />
    );
    const toggleButton = screen.getByText(/Start/i);
    const aimButton = screen.queryByText(/Click Me!/i);
    expect(aimButton).not.toBeInTheDocument();
    await act(async () => {
      userEvent.click(toggleButton);
      await new Promise((resolve) => setTimeout(resolve, 200));
    })
    const newAimButton = screen.queryByText(/Click Me!/i);
    expect(newAimButton).toBeInTheDocument();

    const score = screen.getByTestId('score');
    expect(score).toHaveTextContent('0');

    // Click aim button
    await act(async () => {
      userEvent.click(newAimButton);
      await new Promise((resolve) => setTimeout(resolve, 200));
    })

    // Checking updated score and highscore
    const updatedScore = screen.getByTestId('score');
    const highscore = screen.getByTestId('highscore');
    expect(updatedScore).toHaveTextContent('1');
    expect(highscore).toHaveTextContent('1');

    // Checking score goes back to 0 if missed button
    const missed = screen.getByTestId('container');
    await act(async () => {
      userEvent.click(missed);
      await new Promise((resolve) => setTimeout(resolve, 200));
    })
    const newestScore = screen.getByTestId('score');
    const updatedHighscore = screen.getByTestId('highscore');
    expect(newestScore).toHaveTextContent('0');
    expect(updatedHighscore).toHaveTextContent('1');

    // Wait 30 seconds to pass to see modal popup showing aimlab result
    await act(async () => {
      userEvent.click(screen.queryByText(/Click Me!/i));
      await new Promise((resolve) => setTimeout(resolve, 30000));
    })

    // Check new highscore message is also displayed
    const modalText = screen.getByText(/You scored:/i);
    const newHS = screen.getByText(/well done, you hit a new highscore!!!/i);
    expect(modalText).toBeInTheDocument();
    expect(newHS).toBeInTheDocument();

    const closeBtn = screen.getByTestId('closeScoreModal');
    await act(async () => {
      userEvent.click(closeBtn);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    })
    const updatedModalText = screen.queryByText(/You scored:/i);
    expect(updatedModalText).not.toBeInTheDocument();
  });
});
