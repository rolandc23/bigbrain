import { render, screen } from '@testing-library/react';
import {
  BrowserRouter
} from 'react-router-dom';
import React from 'react';
import RegForm from '../components/RegForm';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';

describe('RegForm', () => {
  it('renders Register button as disabled initially', () => {
    render(
      <BrowserRouter>
        <RegForm />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /Register/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/ })).toBeDisabled();
  });

  it('renders inputs', () => {
    render(
      <BrowserRouter>
        <RegForm />
      </BrowserRouter>
    );
    expect(screen.getByTestId('email').querySelector('input')).toBeInTheDocument();
    expect(screen.getByTestId('password').querySelector('input')).toBeInTheDocument();
    expect(screen.getByTestId('name').querySelector('input')).toBeInTheDocument();
    expect(screen.getByTestId('confirmPassword').querySelector('input')).toBeInTheDocument();
  });

  it('update inputs', async () => {
    render(
      <BrowserRouter>
        <RegForm />
      </BrowserRouter>
    );
    const emailInput = screen.getByTestId('email').querySelector('input');
    const pwInput = screen.getByTestId('password').querySelector('input');
    const nameInput = screen.getByTestId('name').querySelector('input');
    const confirmInput = screen.getByTestId('confirmPassword').querySelector('input');

    // Ensure inputs have updated values as expected
    await act(async () => {
      userEvent.type(confirmInput, '123456');
      userEvent.type(nameInput, 'Roland');
      userEvent.type(pwInput, '123456');
      userEvent.type(emailInput, 'hi@1234');
    });
    expect(emailInput).toHaveValue('hi@1234');
    expect(pwInput).toHaveValue('123456');
    expect(nameInput).toHaveValue('Roland');
    expect(confirmInput).toHaveValue('123456');
  });

  it('Behaviour of registration button', async () => {
    render(
      <BrowserRouter>
        <RegForm />
      </BrowserRouter>
    );
    const emailInput = screen.getByTestId('email').querySelector('input');
    const pwInput = screen.getByTestId('password').querySelector('input');
    const nameInput = screen.getByTestId('name').querySelector('input');
    const confirmInput = screen.getByTestId('confirmPassword').querySelector('input');

    await act(async () => {
      userEvent.type(confirmInput, '123456');
      userEvent.type(nameInput, 'Roland');
      userEvent.type(pwInput, '123456');
      userEvent.type(emailInput, 'hi@1234');
      await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByRole('button', { name: /Register/ })).not.toBeDisabled();
  });

  it('Invalid input message display', async () => {
    render(
        <BrowserRouter>
          <RegForm />
        </BrowserRouter>
    );
    // Initally no messages are displayed
    expect(screen.queryByText(/Email is not valid!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Passwords are not matching!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Password must be 6 characters or longer!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Name must be longer than 1 character!/i)).not.toBeInTheDocument();
    const emailInput = screen.getByTestId('email').querySelector('input');

    await act(async () => {
      userEvent.type(emailInput, 'ji');
      await new Promise((resolve) => setTimeout(resolve, 200));
    })

    // Expect these messages to show after inputting invalid email
    expect(screen.queryByText(/Email is not valid!/i)).toBeInTheDocument();
    expect(screen.queryByText(/Passwords are not matching!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Password must be 6 characters or longer!/i)).toBeInTheDocument();
    expect(screen.queryByText(/Name must be longer than 1 character!/i)).toBeInTheDocument();

    await act(async () => {
      userEvent.type(emailInput, '@1234');
      await new Promise((resolve) => setTimeout(resolve, 200));
    })

    // Email becomes valid
    expect(screen.queryByText(/Email is not valid!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Passwords are not matching!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Password must be 6 characters or longer!/i)).toBeInTheDocument();
    expect(screen.queryByText(/Name must be longer than 1 character!/i)).toBeInTheDocument();

    const nameInput = screen.getByTestId('name').querySelector('input');
    await act(async () => {
      userEvent.type(nameInput, 'Roland');
      await new Promise((resolve) => setTimeout(resolve, 200));
    })

    // Expect these messages to show after changing password but not confirming
    expect(screen.queryByText(/Passwords are not matching!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Password must be 6 characters or longer!/i)).toBeInTheDocument();
    expect(screen.queryByText(/Name must be longer than 1 character!/i)).not.toBeInTheDocument();

    const pwInput = screen.getByTestId('password').querySelector('input');
    await act(async () => {
      userEvent.type(pwInput, '123456');
      await new Promise((resolve) => setTimeout(resolve, 200));
    })

    // Expect these messages to show after confirming pw
    expect(screen.queryByText(/Passwords are not matching!/i)).toBeInTheDocument();
    expect(screen.queryByText(/Password must be 6 characters or longer!/i)).not.toBeInTheDocument();

    const confirmInput = screen.getByTestId('confirmPassword').querySelector('input');
    await act(async () => {
      userEvent.type(confirmInput, '123456');
      await new Promise((resolve) => setTimeout(resolve, 200));
    })

    // Adding name
    expect(screen.queryByText(/Passwords are not matching!/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/ })).not.toBeDisabled();

    // Name too long
    await act(async () => {
      userEvent.type(nameInput, '1245678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890w1234567890');
      await new Promise((resolve) => setTimeout(resolve, 200));
    })

    expect(screen.queryByText(/Name must be shorter than 100 characters!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/ })).toBeDisabled();
  });
});
