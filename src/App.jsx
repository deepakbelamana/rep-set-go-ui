import { Routes, Route } from 'react-router-dom';
import Login from './auth/login/login';
import SignUp from './auth/signup/signup'
import Home from './home/home';
import Workout from './workout/Workout';

import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Navigate } from 'react-router-dom';
import Progress from './progress/progress';
import SetPage from './set/setpage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workout/:groupId"
        element={
          <ProtectedRoute>
            <Workout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/set/:workoutId"
        element={
          <ProtectedRoute>
           <SetPage/>
          </ProtectedRoute>
        }
      />
       <Route
        path="/progress/:workoutId"
        element={
          <ProtectedRoute>
           <Progress />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;

