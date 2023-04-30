import { render, screen } from '@testing-library/react';
import {
  BrowserRouter
} from 'react-router-dom';
import React from 'react';
import LoginForm from '../components/LoginForm';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';

describe('LoginForm', () => {
  it('renders Sign In button as disabled initially', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /Sign In/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/ })).toBeDisabled();
  });

  it('renders inputs', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    expect(screen.getByTestId('email').querySelector('input')).toBeInTheDocument();
    expect(screen.getByTestId('password').querySelector('input')).toBeInTheDocument();
  });

  it('inputs have values updated', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    const emailInput = screen.getByTestId('email').querySelector('input');
    const pwInput = screen.getByTestId('password').querySelector('input');
    await act(async () => {
      userEvent.type(emailInput, 'hi@1234');
      userEvent.type(pwInput, '123456');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    })
    expect(emailInput).toHaveValue('hi@1234');
    expect(pwInput).toHaveValue('123456');
  });

  it('Test that button is enabled after valid inputs are entered', async () => {
    render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
    );
    const emailInput = screen.getByTestId('email').querySelector('input');
    const pwInput = screen.getByTestId('password').querySelector('input');

    await act(async () => {
      userEvent.type(emailInput, 'hi@1234');
      userEvent.type(pwInput, '123456');
      await new Promise((resolve) => setTimeout(resolve, 200));
    })
    expect(screen.getByRole('button', { name: /Sign In/ })).not.toBeDisabled();

    // Cannot test lines 21-38 since they are a try/catch tree with an API fetch call
  });
});
