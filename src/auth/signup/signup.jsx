import { Link, useNavigate } from 'react-router-dom'
import './signup.css'
import { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Signup() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    email: '',
    pwd_hash: '',
    confirmPwd_hash:''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.pwd_hash !== formData.confirmPwd_hash) {
      toast.error('Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          pwd_hash: formData.pwd_hash,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Signup successful! Please login to continue');
        localStorage.clear();
        navigate('/login');
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('Something went wrong');
    }
  };

  return (
    <Container className="py-4">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}> 
          <input type="email" placeholder="Email" name="email" onChange={handleChange}/><br />
          <input type="password" placeholder="Password" name="pwd_hash" onChange={handleChange}/><br />
          <input type="password" placeholder="Confirm Password" name="confirmPwd_hash" onChange={handleChange} /><br />
          <button type="submit">Create Account</button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </Container>
  )
}
