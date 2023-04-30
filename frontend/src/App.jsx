import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DashBoard from './pages/DashBoard';
import EditQuiz from './pages/EditQuiz';
import StartingPage from './pages/StartingPage';
import JoinQuiz from './pages/JoinQuiz';
import StartQuiz from './pages/StartQuiz';
import EditQuestion from './pages/EditQuestion';
import QuizAdmin from './pages/QuizAdmin';
import PrivateRoute from './customRoute/privateRoute';
import PublicRoute from './customRoute/publicRoute';
import PlayQuiz from './pages/PlayQuiz';
import PlayerRoute from './customRoute/playerRoute';
import ResultsAdmin from './pages/ResultsAdmin';
import ResultsPlayer from './pages/ResultsPlayer';
import Nav from './components/Nav';
import Sessions from './pages/Sessions';
import Footer from './components/Footer';

function App () {
  // All the Routes and their corresponding pages
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<StartingPage />} />
          <Route path="/joinquiz" element={<JoinQuiz />} />
          <Route path="/login" element={<PublicRoute><SignIn /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/dashboard/" element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          } />
          <Route path="/editquiz/:quizId" element={
            <PrivateRoute>
              <EditQuiz />
            </PrivateRoute>
          } />
          <Route path="/editquiz/:quizId/:questionId" element={
            <PrivateRoute>
              <EditQuestion />
            </PrivateRoute>
          } />
          <Route path="/startquiz/:quizId/:sessionId" element={
            <PrivateRoute>
              <StartQuiz />
            </PrivateRoute>
          } />
          <Route path="/quizadmin/:quizId/:sessionId" element={
            <PrivateRoute>
              <QuizAdmin />
            </PrivateRoute>
          } />
          <Route path="/playquiz/:sessionId/:playerId" element={
            <PlayerRoute>
              <PlayQuiz />
            </PlayerRoute>
          } />
          <Route path="/results/:playerId" element={<ResultsPlayer />} />
          <Route path="/resultsadmin/:quizId/:sessionId" element={
            <PrivateRoute>
              <ResultsAdmin />
            </PrivateRoute>
          } />
          <Route path="/sessions/:quizId" element={
            <PrivateRoute>
              <Sessions />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
