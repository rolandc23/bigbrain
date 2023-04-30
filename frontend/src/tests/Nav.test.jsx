import { render, screen } from '@testing-library/react';
import Nav from '../components/Nav';
import {
  BrowserRouter
} from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';

describe('Nav', () => {
  it('renders default buttons - sign in/sign up', () => {
    render(
      <BrowserRouter>
        <Nav />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /Sign Up/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/ })).toBeInTheDocument();
  });

  it('renders dashboard/signout if token exists/i.e logged in', () => {
    const testData = { token: 'test' };
    localStorage.setItem('token', JSON.stringify(testData));
    render(
      <BrowserRouter>
        <Nav />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /DashBoard/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Out/ })).toBeInTheDocument();
  });

  it('renders leave quiz button if playerId exists/i.e logged in', () => {
    const testData = 'testPlayerId';
    localStorage.setItem('playerId', JSON.stringify(testData));
    render(
      <BrowserRouter>
        <Nav />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /Leave Quiz/ })).toBeInTheDocument();
  });
});
