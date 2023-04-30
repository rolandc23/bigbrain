import { render, screen } from '@testing-library/react';
import React from 'react';
import StartingPageButtons from '../components/StartingPageButtons';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

describe('Starting Page Buttons', () => {
  it('renders initial buttons - no token', () => {
    render(
    <BrowserRouter>
      <StartingPageButtons />;
    </BrowserRouter>
    );
    const joinQuizBtn = screen.getByText(/Join Quiz/i);
    expect(joinQuizBtn).toBeInTheDocument();
    const loginBtn = screen.getByText(/Log in/i);
    expect(loginBtn).toBeInTheDocument();
  });

  it('renders only join quiz button - no token exists', () => {
    const testData = { token: 'test' };
    localStorage.setItem('token', JSON.stringify(testData));
    render(
    <BrowserRouter>
      <StartingPageButtons />;
    </BrowserRouter>
    );
    const joinQuizBtn = screen.getByText(/Join Quiz/i);
    expect(joinQuizBtn).toBeInTheDocument();
    const loginBtn = screen.queryByText(/Log in/i);
    expect(loginBtn).not.toBeInTheDocument();
  });
});
