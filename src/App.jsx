import './App.css'
import Login from './auth/login/login'
import { Route,Routes } from 'react-router-dom'
import SignUp from './auth/signUp/signUp'
import Home from './home/home'
export default function App() {
  

  return (
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<SignUp />} />
    <Route path="/home" element={<Home />} />
  </Routes>
  )
}

