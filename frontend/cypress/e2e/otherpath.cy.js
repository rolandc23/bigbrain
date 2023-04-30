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
      .type('test2@email');
    cy.get('input[name="regName"]')
      .should('be.visible')
      .focus()
      .type('test2 user');
    cy.get('input[name="regPw"]')
      .should('be.visible')
      .focus()
      .type('123456');
    cy.get('input[name="regConfirmPw"]')
      .should('be.visible')
      .focus()
      .type('123456');
    cy.get('button[name="regSubmitBtn"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/dashboard')
  })

  it('should make new game', () => {
    cy.get('button[name="toggleNewGameForm"]')
      .should('not.be.disabled')
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

  it('should access edit quiz page and upload quiz', () => {
    cy.get('button[name="new game"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/editquiz');
    cy.get('input[name="importQuiz"]')
      .should('be.visible')
      .selectFile('upload_example/2.5.json');
  })

  it('should save quiz', () => {
    cy.get('button[name="saveQuizBtn"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/dashboard');
  })

  it('Edit quiz again and add a question and remove the question', () => {
    cy.get('button[name="League of Legends"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/editquiz');
    cy.get('button[name="addQuestionBtn"]')
      .should('not.be.disabled')
      .click();
    cy.get('button[name="removeQuestionBtn-10"]')
      .should('not.be.disabled')
      .wait(1000)
      .click();
  })

  it('Add question and go to its edit page', () => {
    cy.get('button[name="addQuestionBtn"]')
      .should('not.be.disabled')
      .click();
    cy.get('button[name="editQuestion-10"]')
      .should('not.be.disabled')
      .click();
  })

  it('edit question and save', () => {
    cy.get('input[name="editQuestionStr"]')
      .should('be.visible')
      .focus()
      .wait(2000)
      .clear()
      .wait(2000)
      .type('changed q name');
    cy.get('input[name="editQuestionDuration"]')
      .should('be.visible')
      .focus()
      .wait(1000)
      .clear()
      .wait(1000)
      .type('15');
    cy.get('input[name="editQuestionPoints"]')
      .should('be.visible')
      .focus()
      .wait(1000)
      .clear()
      .wait(1000)
      .type('2000');
    cy.get('#selectUploadType')
      .should('be.visible')
      .parent()
      .click()
      .wait(500)
      .get('ul > li[data-value="uploadImage"]')
      .wait(500)
      .click();
    cy.get('input[name="uploadQuestionImage"]')
      .should('be.visible')
      .wait(1000)
      .selectFile('src/images/duckrace.png');
    cy.get('#editQuestionType')
      .should('be.visible')
      .parent()
      .click()
      .wait(500)
      .get('ul > li[data-value="singleAnswer"]')
      .wait(500)
      .click();
    cy.get('#editQuestionNumOptions')
      .should('be.visible')
      .parent()
      .click()
      .wait(500)
      .get('ul > li[data-value="4"]')
      .wait(500)
      .click();
    cy.get('input[name="singleC"]')
      .should('be.visible')
      .check();
    cy.get('input[name="singleD"]')
      .should('be.visible')
      .check();
    cy.get('input[name="optionA"]')
      .should('be.visible')
      .focus()
      .clear()
      .type('changed option A');
    cy.get('input[name="optionB"]')
      .should('be.visible')
      .focus()
      .clear()
      .type('changed option B');
    cy.get('input[name="optionC"]')
      .should('be.visible')
      .focus()
      .clear()
      .type('changed option C');
    cy.get('input[name="optionD"]')
      .should('be.visible')
      .focus()
      .clear()
      .type('changed option D');
    cy.get('button[name="saveQuestionBtn"]')
      .should('not.be.disabled')
      .wait(1000)
      .click()
    cy.get('button[name="saveQuizBtn"]')
      .should('not.be.disabled')
      .wait(1000)
      .click();
    cy.url().should('include', 'localhost:3000/dashboard')
  });

  it('should enter start quiz page', () => {
    cy.get('button[name="start-League of Legends"]')
      .should('not.be.disabled')
      .click();
    cy.get('button[name="closeModalBtn"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/startquiz/');
  })

  it('should enter start quiz page', () => {
    cy.get('button[name="startQuestionsBtn"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/quizadmin/');
    cy.get('button[name="advanceQuiz"]')
      .should('not.be.disabled')
      .wait(5000)
      .click();
    cy.get('button[name="advanceQuiz"]')
      .should('not.be.disabled')
      .wait(5000)
      .click();
    cy.get('button[name="advanceQuiz"]')
      .should('not.be.disabled')
      .wait(5000)
      .click();
    cy.get('button[name="advanceQuiz"]')
      .should('not.be.disabled')
      .wait(5000)
      .click();
    cy.get('button[name="advanceQuiz"]')
      .should('not.be.disabled')
      .wait(5000)
      .click();
    cy.get('button[name="advanceQuiz"]')
      .should('not.be.disabled')
      .wait(5000)
      .click();
    cy.get('button[name="advanceQuiz"]')
      .should('not.be.disabled')
      .wait(5000)
      .click();
    cy.get('button[name="advanceQuiz"]')
      .should('not.be.disabled')
      .wait(5000)
      .click();
    cy.get('button[name="advanceQuiz"]')
      .should('not.be.disabled')
      .wait(5000)
      .click();
    cy.get('button[name="advanceQuiz"]')
      .should('not.be.disabled')
      .wait(5000)
      .click();
    cy.get('button[name="adminEndQuizBtn"]')
      .should('not.be.disabled')
      .wait(5000)
      .click();
    cy.get('button[name="goResults"]')
      .should('not.be.disabled')
      .wait(3000)
      .click();
    cy.url().should('include', 'localhost:3000/resultsadmin/')
  });

  it('go back to dashboard and check old sessions', () => {
    cy.get('[name=dashboardNavBtn]')
      .should('not.be.disabled')
      .click();
    cy.url()
      .should('include', 'localhost:3000/dashboard')
    cy.get('[name="oldSesh-League of Legends"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/sessions/')
    cy.get('button[name="0"]')
      .should('not.be.disabled')
      .click();
    cy.url().should('include', 'localhost:3000/resultsadmin/')
  });

  it('go back to dashboard,delete quiz and sign out', () => {
    cy.get('button[name="dashboardNavBtn"]')
      .should('not.be.disabled')
      .click();
    cy.url()
      .should('include', 'localhost:3000/dashboard')
    cy.get('button[name="delete-League of Legends"]')
      .should('not.be.disabled')
      .click();
    cy.get('button[name="signoutNavBtn"]')
      .should('not.be.disabled')
      .click();
  })

  it('Attempt to access admin pages once logged out', () => {
    cy.visit('localhost:3000/dashboard')
      .wait(500)
    cy.url()
      .should('not.include', 'dashboard')
    cy.visit('localhost:3000/resultsadmin/12/12')
      .wait(500)
    cy.url()
      .should('not.include', 'resultsadmin')
    cy.visit('localhost:3000/editquiz/12/12')
      .wait(500)
    cy.url()
      .should('not.include', 'editquiz')
    cy.visit('localhost:3000/editquiz/12')
      .wait(500)
    cy.url()
      .should('not.include', 'editquiz')
    cy.visit('localhost:3000/startquiz/10/10')
      .wait(500)
    cy.url()
      .should('not.include', 'startquiz')
  });
});
