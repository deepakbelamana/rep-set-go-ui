import { Routes, Route } from 'react-router-dom';
import Login from './auth/login/login';
import SignUp from './auth/signup/signup'
import Home from './home/home';
import Workout from './workout/Workout';
import Set from './set/Set';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Navigate } from 'react-router-dom';

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
            <Set />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;

