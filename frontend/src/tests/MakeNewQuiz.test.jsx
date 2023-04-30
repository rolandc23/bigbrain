import { render, screen } from '@testing-library/react';
import React from 'react';
import MakeNewQuiz from '../components/MakeNewQuiz';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';

describe('MakeNewQuiz', () => {
  it('Check behaviour of hidden state', () => {
    render(
      <MakeNewQuiz newGameShow={false} setNewGameShow={() => { return true }} />
    );
    const toggleButton = screen.getByText(/Create new game/i);
    expect(toggleButton).toBeInTheDocument();
  });

  it('Check behaviour of showing state', () => {
    render(
      <MakeNewQuiz newGameShow={true} setNewGameShow={() => { return false }} />
    );
    const toggleButton = screen.getByText(/Hide new game form/i);
    expect(toggleButton).toBeInTheDocument();

    const createGameBtn = screen.getByTestId('createGameBtn');
    expect(createGameBtn).toBeInTheDocument();
    expect(createGameBtn).toBeDisabled();
  });

  it('Check behaviour of create game button enabling', async () => {
    render(
      <MakeNewQuiz newGameShow={true} setNewGameShow={() => { return false }} />
    );
    const createGameBtn = screen.getByTestId('createGameBtn');
    expect(createGameBtn).toBeDisabled();

    const newGameInput = screen.getByTestId('newGameNameInput').querySelector('input');
    await act(async () => {
      userEvent.type(newGameInput, 'hi');
      await new Promise((resolve) => setTimeout(resolve, 200));
    })
    expect(createGameBtn).not.toBeDisabled();
  });
});
