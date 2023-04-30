Our approach to testing the application is based on the 'Testing Pyramid', which has unit/component tests 
as its basis, followed by integration tests and then UI testing. The main objective of our tests is to 
provide as much coverage throughout the entirety of the program, ensuring that no 'errors' are missed. 

Component/unit tests were the main focus early on the project as we needed to ensure that these were properly 
functional before we integrated them into a more complex environment. These were simply testing the functions 
of e.g. styled buttons and inputs and that they had the intended behaviour whilst also being enabled/disabled 
in certain situations. Input values were also verified, although we ran into flaky cases where we needed to 
provide a delay using setTimeout after calling userEvent.type(). The methodology was to provide enough test 
cases (edge cases included) so that every single branch of our code for each component was explored at 
least once. However, we ran into coverage issues when it came to more complex integration tests which were 
testing the behaviour of components which traverses into a branch of an API call (e.g. submit login button). 
These cases were handled through manual testing, and later on in the UI testing.

As more and more components began to pass their tests, we then converted these component tests into integrated 
tests which tests environments containing various components (e.g. the 'Aimlab' test). Similar to the component 
tests, we ran into flaky scenarios where we would need to add a setTimeout before an assertion due to the delay 
of React states changing (e.g. loginform invalid messages).

Nearing the completion the application, we began to write UI tests, a 'happypath' test which tests the UI on 
a very shallow level, and another test 'otherpath' to which we discerned a path that provides almost 100% 
coverage to the administration side of our application. In our own 'otherpath' test, we test the functionalities 
of importing quizzes, adding and removing questions, editing questions (in its entirety, changing every possible 
option before saving), as well as starting the game and progressing through each question via the advance button. 
We then tested that old sessions became accessible after a quiz session has ended, and that the user is able to 
delete the quiz, before finishing off with 'access' tests which ensures that all administration pages are inaccessible 
to an invalid user, for which the behaviour would be to redirect them to the 'starting page'.

Limitations were recognised however, as Cypress is not able to run tests involving multiple browsers, meaning that 
player-sided tests are not possible. These checks, alongside with 'keyboard tests', were nevertheless manually 
tested.
