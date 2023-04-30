/* eslint-disable no-undef */
import data from '../../src/config.json'

describe('user happy path', () => {
  localStorage.removeItem('token');
  it('should navigate to home screen', () => {
    cy.visit(`localhost:${data.FRONTEND_PORT}/`);
    cy.url().should('include', 'localhost:3000/');
  });

  it('should go to register page', () => {
    cy.url().should('include', 'localhost:3000');
    cy.get('button[name="registerNavBtn"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/register');
  })

  it('should register user and navigate to dashboard', () => {
    cy.get('button[name="regSubmitBtn"]')
      .should('be.disabled')
    cy.get('input[name="regEmail"]')
      .should('be.visible')
      .focus()
      .type('test@email')
      .should('have.value', 'test@email')
    cy.get('input[name="regName"]')
      .should('be.visible')
      .focus()
      .type('test user')
      .should('have.value', 'test user')
    cy.get('input[name="regPw"]')
      .should('be.visible')
      .focus()
      .type('123456')
      .should('have.value', '123456')
    cy.get('input[name="regConfirmPw"]')
      .should('be.visible')
      .focus()
      .type('123456')
      .should('have.value', '123456')
    cy.get('button[name="regSubmitBtn"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/dashboard')
  })

  it('should make new game', () => {
    cy.get('button[name="toggleNewGameForm"]')
      .should('be.visible')
      .click();
    cy.get('button[name="createGameBtn"]')
      .should('be.disabled')
    cy.get('input[name="newGameNameInput"]')
      .should('be.visible')
      .focus()
      .type('new game');
    cy.get('button[name="createGameBtn"]')
      .should('not.be.disabled')
      .click();
  })

  it('should edit thumbnail and name of quiz', () => {
    cy.get('button[name="new game"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/editquiz');
    cy.get('input[name="editQuizName"]')
      .should('be.visible')
      .focus()
      .clear()
      .type('changed name');
    cy.get('input[name="editQuizThumbnail"]')
      .should('be.visible')
      .selectFile('src/images/duckrace.png');
    cy.get('img[name="image-preview"]')
      .should('be.visible');
    cy.get('button[name="saveQuizBtn"]')
      .should('not.be.disabled')
      .click();
  })

  it('should start quiz', () => {
    cy.get('button[name="start-changed name"]')
      .should('not.be.disabled')
      .click();
    cy.get('button[name="closeModalBtn"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/startquiz/');
    cy.get('button[name="startQuestionsBtn"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/quizadmin/');
  })

  it('should end quiz', () => {
    cy.get('button[name="adminEndQuizBtn"]')
      .should('not.be.disabled')
      .click();
    cy.get('button[name="goResults"]')
      .should('not.be.disabled')
      .click();
  })

  it('results page should be loaded', () => {
    cy.url().should('include', 'localhost:3000/resultsadmin/');
  })

  it('log out', () => {
    cy.get('button[name="signoutNavBtn"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/login');
  })

  it('log back in', () => {
    cy.get('button[name="loginBtn"]')
      .should('be.disabled')
    cy.get('input[id="email"]')
      .should('be.visible')
      .focus()
      .type('test@email');
    cy.get('input[id="password"]')
      .should('be.visible')
      .focus()
      .type('123456');
    cy.get('button[name="loginBtn"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/dashboard')
  })
});
